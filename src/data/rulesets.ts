export type RulesetSlug = 'civil' | 'criminal' | 'appellate' | 'evidence' | 'bankruptcy';

export interface RulesetConfig {
  collection: RulesetSlug;
  fullName: string;
  shortName: string;
  citationBase: string;
  groupLabel: string;
  urlSegment: RulesetSlug;
  ruleNumWidth: string;
  hasLetterRules: boolean;
  showDeadlines: boolean;
  sourceLabel: string;
}

export const RULESETS: Record<RulesetSlug, RulesetConfig> = {
  civil: {
    collection: 'civil',
    fullName: 'Federal Rules of Civil Procedure',
    shortName: 'Civil Procedure',
    citationBase: 'Fed. R. Civ. P.',
    groupLabel: 'Title',
    urlSegment: 'civil',
    ruleNumWidth: '1.75rem',
    hasLetterRules: true,
    showDeadlines: true,
    sourceLabel: 'Fed. R. Civ. P.',
  },
  criminal: {
    collection: 'criminal',
    fullName: 'Federal Rules of Criminal Procedure',
    shortName: 'Criminal Procedure',
    citationBase: 'Fed. R. Crim. P.',
    groupLabel: 'Title',
    urlSegment: 'criminal',
    ruleNumWidth: '1.75rem',
    hasLetterRules: true,
    showDeadlines: true,
    sourceLabel: 'Fed. R. Crim. P.',
  },
  appellate: {
    collection: 'appellate',
    fullName: 'Federal Rules of Appellate Procedure',
    shortName: 'Appellate Procedure',
    citationBase: 'Fed. R. App. P.',
    groupLabel: 'Title',
    urlSegment: 'appellate',
    ruleNumWidth: '1.75rem',
    hasLetterRules: false,
    showDeadlines: false,
    sourceLabel: 'Fed. R. App. P.',
  },
  evidence: {
    collection: 'evidence',
    fullName: 'Federal Rules of Evidence',
    shortName: 'Evidence',
    citationBase: 'Fed. R. Evid.',
    groupLabel: 'Article',
    urlSegment: 'evidence',
    ruleNumWidth: '2.5rem',
    hasLetterRules: false,
    showDeadlines: false,
    sourceLabel: 'Fed. R. Evid.',
  },
  bankruptcy: {
    collection: 'bankruptcy',
    fullName: 'Federal Rules of Bankruptcy Procedure',
    shortName: 'Bankruptcy Procedure',
    citationBase: 'Fed. R. Bankr. P.',
    groupLabel: 'Part',
    urlSegment: 'bankruptcy',
    ruleNumWidth: '2.75rem',
    hasLetterRules: false,
    showDeadlines: false,
    sourceLabel: 'Fed. R. Bankr. P.',
  },
};

export const RULESET_SLUGS = Object.keys(RULESETS);
