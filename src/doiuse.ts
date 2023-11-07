import type { Document, Element } from 'domhandler';
// eslint-disable-next-line import/no-extraneous-dependencies
import { getProperty } from 'dot-prop';
import { ElementType } from 'htmlparser2';
import styleToObject from 'style-to-object';

import type { CssDeclarationAST, CssStylesheetAST } from '@adobe/css-tools';

import type { DoIUseEmailOptions, EmailClient } from './types';
import { getEmailClientsFromOptions, getEmailClientSupportStatus } from './utils/email-clients';
import { getAllFeatures, getCSSFeatures } from './utils/features';
import { parseHtml } from './utils/parse-html';
import {
  getMatchingAtRuleTitles,
  getMatchingFunctionTitles,
  getMatchingKeywordTitles,
  getMatchingPropertyTitles,
  getMatchingPropertyValuePairTitles,
  getMatchingPseudoSelectorTitles,
  getMatchingSelectorTitles,
  getMatchingUnitTitles
} from './utils/titles/css';
import {
  getMatchingAttributeTitles,
  getMatchingElementAttributePairTitles,
  getMatchingElementTitles
} from './utils/titles/html';

const atRules = new Set([
  'charset',
  'custom-media',
  'document',
  'font-face',
  'host',
  'import',
  'keyframes',
  'keyframe',
  'media',
  'namespace',
  'page',
  'supports'
]);

interface Feature {
  link: string;
  name: string;
  notes?: string[];
}

export class DoIUseEmail {
  emailClients: EmailClient[];
  options: DoIUseEmailOptions;
  warnings: string[] = [];
  errors: string[] = [];
  notes: string[] = [];

  constructor(options: DoIUseEmailOptions) {
    const emailClients = getEmailClientsFromOptions(options);

    if (emailClients.length === 0) {
      throw new Error(
        `The specified email client(s) (${options.emailClients.join(', ')}) were not found`
      );
    }

    this.emailClients = emailClients;
    this.options = options;
  }

  checkFeaturesSupport(featureTitles: string | string[]) {
    const features = getAllFeatures();

    for (const featureTitle of [featureTitles].flat()) {
      for (const emailClient of this.emailClients) {
        const feature = features[featureTitle];
        if (feature === void 0) {
          throw new Error(`Feature \`${featureTitle}\` not found.`);
        }

        const { stats } = feature;
        const supportMap = getProperty(stats, emailClient);

        if (supportMap === void 0) {
          throw new Error(`Feature \`${featureTitle}\` not found on \`${emailClient}\`.`);
        }

        const supportStatus = getEmailClientSupportStatus(supportMap);
        if (supportStatus.type === 'none') {
          this.error(`\`${featureTitle}\` is not supported by \`${emailClient}\``);
        } else if (supportStatus.type === 'partial') {
          this.warning(`\`${featureTitle}\` is only partially supported by \`${emailClient}\``);
        }

        for (const noteNumber of supportStatus.noteNumbers ?? []) {
          this.note(
            `Note about \`${featureTitle}\` support for \`${emailClient}\`: ${feature.notes_by_num![
              String(noteNumber)
            ]!}`
          );
        }
      }
    }
  }

  error(message: string) {
    this.errors.push(message);
  }

  warning(message: string) {
    this.warnings.push(message);
  }

  note(message: string) {
    this.notes.push(message);
  }

  checkCSSDeclarations(declarations: Array<{ property: string; value: string }>) {
    const cssFeatures = getCSSFeatures();

    for (const declaration of declarations) {
      const { property: propertyName, value: propertyValue } = declaration;

      // Check that the property name is supported
      if (propertyName !== void 0 && cssFeatures[propertyName] !== void 0) {
        const matchingPropertyTitles = getMatchingPropertyTitles({
          propertyName
        });
        this.checkFeaturesSupport(matchingPropertyTitles);
      }

      // Check that the units and functions in the property value are supported
      if (propertyValue !== void 0) {
        const matchingFunctionTitles = getMatchingFunctionTitles({
          propertyValue
        });
        this.checkFeaturesSupport(matchingFunctionTitles);
        const matchingUnitTitles = getMatchingUnitTitles({ propertyValue });
        this.checkFeaturesSupport(matchingUnitTitles);
        const matchingKeywordTitles = getMatchingKeywordTitles({
          propertyValue
        });
        this.checkFeaturesSupport(matchingKeywordTitles);
      }

      // Check that the property name + value pair is supported
      if (propertyName !== void 0 && propertyValue !== void 0) {
        const matchingPropertyValuePairTitles = getMatchingPropertyValuePairTitles({
          propertyName,
          propertyValue
        });
        this.checkFeaturesSupport(matchingPropertyValuePairTitles);
      }
    }
  }

  checkCSSSelectors(selectors: string[]) {
    for (const selector of selectors) {
      const matchingPseudoSelectorTitles = getMatchingPseudoSelectorTitles({
        selector
      });
      this.checkFeaturesSupport(matchingPseudoSelectorTitles);
      const matchingSelectorTitles = getMatchingSelectorTitles({ selector });
      this.checkFeaturesSupport(matchingSelectorTitles);
    }
  }

  checkStylesheet(stylesheet: CssStylesheetAST) {
    const matchedAtRules: string[] = [];
    for (const stylesheetRule of stylesheet.stylesheet?.rules ?? []) {
      if (stylesheetRule.type === 'rule') {
        const rule = stylesheetRule;
        const declarations = (rule.declarations ?? [])
          .filter((declaration) => declaration.type !== 'comment')
          .map((declaration) => {
            return {
              property: (declaration as CssDeclarationAST).property,
              value: (declaration as CssDeclarationAST).value
            };
          });

        this.checkCSSDeclarations(declarations);
        this.checkCSSSelectors(rule.selectors ?? []);
      }

      if (atRules.has(stylesheetRule.type)) {
        matchedAtRules.push(stylesheetRule.type);
      }
    }

    const matchingAtRuleTitles = getMatchingAtRuleTitles({
      atRules: matchedAtRules
    });
    this.checkFeaturesSupport(matchingAtRuleTitles);
  }

  checkHtmlNode(node: Element) {
    const matchingElementTitles = getMatchingElementTitles({
      tagName: node.tagName
    });
    this.checkFeaturesSupport(matchingElementTitles);
    if (node.attributes !== void 0) {
      const matchingAttributeTitles = getMatchingAttributeTitles({
        attributes: node.attributes.map((attr) => attr.name)
      });
      this.checkFeaturesSupport(matchingAttributeTitles);
      const matchingElementAttributePairTitles = getMatchingElementAttributePairTitles({
        attributes: Object.fromEntries(node.attributes.map((attr) => [attr.name, attr.value])),
        tagName: node.tagName
      });
      this.checkFeaturesSupport(matchingElementAttributePairTitles);

      // Check inline styles
      const styleAttr = node.attributes.find((attr) => attr.name === 'style');
      if (styleAttr !== void 0) {
        const styleObject = ((styleToObject as any).default ?? styleToObject)(styleAttr.value);
        if (styleObject !== null) {
          this.checkCSSDeclarations(
            Object.entries(styleObject).map(
              ([property, value]) =>
                ({
                  property,
                  value
                } as any)
            )
          );
        }
      }
    }

    if ('childNodes' in node) {
      for (const childNode of node.childNodes) {
        if (childNode.type === ElementType.Tag) {
          this.checkHtmlNode(childNode as Element);
        }
      }
    }
  }

  checkHtml(document: Document) {
    for (const childNode of document.childNodes) {
      if (childNode.type === ElementType.Tag) {
        this.checkHtmlNode(childNode as Element);
      }
    }
  }

  check(
    code: string
  ): { notes: string[]; warnings: string[] } & (
    | { success: true }
    | { errors: string[]; success: false }
  ) {
    const { document, stylesheets } = parseHtml(code);

    // Check the CSS
    for (const stylesheet of stylesheets) {
      this.checkStylesheet(stylesheet);
    }

    // Check the HTML
    this.checkHtml(document);

    if (this.errors.length === 0) {
      return {
        notes: this.notes,
        success: true,
        warnings: this.warnings
      };
    }
    return {
      errors: this.errors,
      notes: this.notes,
      success: false,
      warnings: this.warnings
    };
  }

  getSupportedFeatures() {
    const features = getAllFeatures();
    const supportedFeatures: Feature[] = [];

    for (const [featureTitle, featureData] of Object.entries(features)) {
      const currentFeature: Feature = {
        link: featureData.url,
        name: featureTitle
      };
      let isFeatureSupported = true;

      for (const emailClient of this.emailClients) {
        const { stats } = featureData;
        const supportMap = getProperty(stats, emailClient);

        // eslint-disable-next-line no-continue
        if (supportMap === void 0) continue;

        const supportStatus = getEmailClientSupportStatus(supportMap);

        if (supportStatus.type === 'none') {
          isFeatureSupported = false;
          break;
        }

        if (supportStatus.type === 'partial') {
          currentFeature.notes ??= [];

          for (const noteNumber of supportStatus.noteNumbers ?? []) {
            currentFeature.notes.push(
              `Note about \`${featureTitle}\` support for \`${emailClient}\`: ${featureData.notes_by_num![
                String(noteNumber)
              ]!}`
            );
          }
        }
      }

      if (isFeatureSupported) {
        supportedFeatures.push(currentFeature);
      }
    }

    return supportedFeatures;
  }
}

export function doIUseEmail(code: string, options: DoIUseEmailOptions) {
  return new DoIUseEmail(options).check(code);
}
