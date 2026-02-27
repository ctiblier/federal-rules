import { visit } from 'unist-util-visit';

// Label detection in priority order.
// Roman numerals (level 4) checked BEFORE lowercase (level 1) to prevent
// (i), (v), (x) being misidentified as lowercase-letter labels.
const LABEL_PATTERNS = [
  { level: 4, re: /^\((i{1,3}|iv|vi{0,3}|ix|x{1,3}|xi{1,3}|xiv|xvi{0,3}|xix|xx)\)$/i },
  { level: 1, re: /^\(([a-z])\)$/ },
  { level: 2, re: /^\((\d+)\)$/ },
  { level: 3, re: /^\(([A-Z])\)$/ },
];

/**
 * Extract the label token from the beginning of a strong element's text.
 * Returns { level, labelValue } or null.
 *
 * Examples:
 *   "(a) Contents; Amendments." → { level: 1, labelValue: "a" }
 *   "(1) General." → { level: 2, labelValue: "1" }
 *   "(A)" → { level: 3, labelValue: "A" }
 *   "(i)" → { level: 4, labelValue: "i" }
 */
function detectLabel(text) {
  // Extract only the first whitespace-delimited token — the label itself
  const token = text.trim().split(/\s/)[0];
  for (const { level, re } of LABEL_PATTERNS) {
    const m = re.exec(token);
    if (m) {
      return { level, labelValue: m[1] };
    }
  }
  return null;
}

/**
 * Rehype plugin: adds id attributes to <p> elements that begin with a
 * subsection label in a <strong> child.
 *
 * Tracks a hierarchical path so nested labels produce compound IDs:
 *   (a) → id="a"
 *   (a)(1) → id="a-1"
 *   (a)(1)(A) → id="a-1-A"
 *   (a)(1)(A)(i) → id="a-1-A-i"
 *
 * When a higher-level label appears, deeper levels reset:
 *   (a)(1)(A) then (b) → path resets to ["b", "", "", ""]
 */
export default function rehypeSubsectionAnchors() {
  return (tree) => {
    // path[0]=level1 (a/b/...), path[1]=level2 (1/2/...), path[2]=level3 (A/B/...), path[3]=level4 (i/ii/...)
    const path = ['', '', '', ''];

    visit(tree, 'element', (node) => {
      if (node.tagName !== 'p') return;

      // Find the first <strong> child element
      const strong = node.children?.find(
        (child) => child.type === 'element' && child.tagName === 'strong'
      );
      if (!strong) return;

      // Get text content of the <strong> element (concatenate all text nodes)
      const strongText = strong.children
        ?.filter((child) => child.type === 'text')
        .map((child) => child.value)
        .join('');
      if (!strongText) return;

      const detected = detectLabel(strongText);
      if (!detected) return;

      const { level, labelValue } = detected;

      // Update path: set this level's label, clear all deeper levels
      path[level - 1] = labelValue;
      for (let deeper = level; deeper < 4; deeper++) {
        path[deeper] = '';
      }

      // Build the id from non-empty path segments joined by hyphens
      const id = path.filter(Boolean).join('-');

      // Attach id and data-level to the <p> element
      if (!node.properties) node.properties = {};
      node.properties.id = id;
      node.properties['data-level'] = String(level);
    });
  };
}
