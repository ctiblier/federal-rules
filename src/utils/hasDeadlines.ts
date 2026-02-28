/**
 * Compute whether a rule body actually contains time-period deadlines.
 *
 * The scraper's `has_deadlines` flag is a conservative over-approximation
 * (designed never to miss a real deadline). This utility re-applies the same
 * regex that the rule-page client JS uses so the sidebar and index pages are
 * consistent with what the rule page badge shows.
 *
 * Amendment-notice HTML is stripped first so abbreviations like
 * "eff. Mar. 19, 1948" don't trigger false positives.
 */

const DEADLINE_RE =
  /\b\d+\s*(?:calendar\s+|business\s+|court\s+)?(?:days?|hours?|months?|years?|weeks?)\b(?!\s+(?:old\b|of\s+age))/i;

// Strips <p class="amendment-history">…</p> blocks (including multi-line).
const NOTICE_RE = /<p class="amendment-history">[\s\S]*?<\/p>/g;

export function computeHasDeadlines(entry: {
  data: { has_deadlines: boolean };
  body?: string;
}): boolean {
  if (!entry.data.has_deadlines) return false;
  const body = (entry.body ?? '').replace(NOTICE_RE, '');
  return DEADLINE_RE.test(body);
}
