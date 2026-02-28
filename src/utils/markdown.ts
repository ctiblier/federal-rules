/**
 * Strip Markdown formatting so diffs and comparisons operate on plain text.
 * Removes **bold**, *italic*, headings, and HTML tags (e.g. amendment notices).
 */
export function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/gs, '$1')   // **bold** → bold
    .replace(/\*(.+?)\*/gs, '$1')        // *italic* → italic
    .replace(/^#{1,6}\s+/gm, '')         // ### Heading → Heading
    .replace(/<[^>]+>/g, '')             // strip HTML tags
    .replace(/[—–]/g, '-')              // normalize em-dash/en-dash → hyphen
    .replace(/\n{3,}/g, '\n\n')          // collapse excess blank lines
    .trim();
}

/**
 * Return true if the two raw Markdown bodies differ when compared as plain text.
 */
export function hasChanged(bodyA: string, bodyB: string): boolean {
  return stripMarkdown(bodyA) !== stripMarkdown(bodyB);
}
