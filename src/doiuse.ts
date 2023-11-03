import type { Declaration, Rule, Stylesheet } from 'css';
import type { Document, Element } from 'domhandler';
// eslint-disable-next-line import/no-extraneous-dependencies
import { getProperty } from 'dot-prop';
import { ElementType } from 'htmlparser2';
import styleToObject from 'style-to-object';

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

interface SupportedFeature {
  link: string;
  name: string;
  notes?: string[];
}

type Clients = string[];
type Feature = string;
type InternalClients = Set<string>;

interface Issues {
  errors: Record<Feature, InternalClients>;
  warnings: Record<Feature, InternalClients>;
}

interface Messages {
  errors: string[];
  notes: string[];
  warnings: string[];
}

interface InternalNote {
  clients: InternalClients;
  feature: string;
  note: string;
}

type Note = InternalNote & {
  clients: string[];
};

interface CheckResult {
  issues: {
    errors: Record<Feature, Clients>;
    warnings: Record<Feature, Clients>;
  };
  messages: Messages;
  notes: Note[];
  success: boolean;
}

const mapIssues = (issues: Record<Feature, InternalClients>): Record<Feature, Clients> =>
  Object.fromEntries(Object.entries(issues).map(([key, value]) => [key, Array.from(value)]));

const mapNotes = (notes: Record<string, InternalNote>): Note[] =>
  Object.values(notes).map(({ clients, feature, note }) => {
    return { clients: Array.from(clients), feature, note };
  }) as Note[];

export class DoIUseEmail {
  emailClients: EmailClient[];
  options: DoIUseEmailOptions;
  issues: Issues = { errors: {}, warnings: {} };
  messages: Messages = { errors: [], notes: [], warnings: [] };
  notes: Record<string, InternalNote> = {};

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

  check(code: string): CheckResult {
    const { document, stylesheets } = parseHtml(code);

    for (const stylesheet of stylesheets) {
      this.checkStylesheet(stylesheet);
    }

    this.checkHtml(document);

    return {
      issues: {
        errors: mapIssues(this.issues.errors),
        warnings: mapIssues(this.issues.warnings)
      },
      messages: this.messages,
      notes: mapNotes(this.notes),
      success: Object.keys(this.issues.errors).length > 0
    };
  }

  getSupportedFeatures() {
    const features = getAllFeatures();
    const supportedFeatures: SupportedFeature[] = [];

    for (const [featureTitle, featureData] of Object.entries(features)) {
      const currentFeature: SupportedFeature = {
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

  private checkFeaturesSupport(featureTitles: string | string[]) {
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
          this.error(featureTitle, emailClient);
        } else if (supportStatus.type === 'partial') {
          this.warning(featureTitle, emailClient);
        }

        for (const noteNumber of supportStatus.noteNumbers ?? []) {
          this.note(featureTitle, emailClient, feature.notes_by_num![String(noteNumber)]!);
        }
      }
    }
  }

  private error(feature: string, client: string) {
    if (!this.issues.errors[feature]) this.issues.errors[feature] = new Set();
    this.issues.errors[feature].add(client);

    this.messages.errors.push(`\`${feature}\` is not supported by \`${client}\``);
  }

  private warning(feature: string, client: string) {
    if (!this.issues.warnings[feature]) this.issues.warnings[feature] = new Set();
    this.issues.warnings[feature].add(client);

    this.messages.warnings.push(`\`${feature}\` is only partially supported by \`${client}\``);
  }

  private note(feature: string, client: string, note: string) {
    const key = feature + note;
    if (!this.notes[key]) this.notes[key] = { clients: new Set(client), feature, note };
    else this.notes[key].clients.add(client);

    this.messages.notes.push(`Note about \`${feature}\` support for \`${client}\`: ${note}`);
  }

  private checkCSSDeclarations(declarations: Array<{ property: string; value: string }>) {
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

  private checkCSSSelectors(selectors: string[]) {
    for (const selector of selectors) {
      const matchingPseudoSelectorTitles = getMatchingPseudoSelectorTitles({
        selector
      });
      this.checkFeaturesSupport(matchingPseudoSelectorTitles);
      const matchingSelectorTitles = getMatchingSelectorTitles({ selector });
      this.checkFeaturesSupport(matchingSelectorTitles);
    }
  }

  private checkStylesheet(stylesheet: Stylesheet) {
    const matchedAtRules: string[] = [];
    for (const stylesheetRule of stylesheet.stylesheet?.rules ?? []) {
      if (stylesheetRule.type === 'rule') {
        const rule = stylesheetRule as Rule;
        const declarations = (rule.declarations ?? [])
          .filter((declaration) => declaration.type !== 'comment')
          .map((declaration) => {
            return {
              property: (declaration as Declaration).property!,
              value: (declaration as Declaration).value!
            };
          });

        this.checkCSSDeclarations(declarations);
        this.checkCSSSelectors(rule.selectors ?? []);
      }

      if (atRules.has(stylesheetRule.type!)) {
        matchedAtRules.push(stylesheetRule.type!);
      }
    }

    const matchingAtRuleTitles = getMatchingAtRuleTitles({
      atRules: matchedAtRules
    });
    this.checkFeaturesSupport(matchingAtRuleTitles);
  }

  private checkHtmlNode(node: Element) {
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

  private checkHtml(document: Document) {
    for (const childNode of document.childNodes) {
      if (childNode.type === ElementType.Tag) {
        this.checkHtmlNode(childNode as Element);
      }
    }
  }
}

export const doIUseEmail = (code: string, options: DoIUseEmailOptions) =>
  new DoIUseEmail(options).check(code);
