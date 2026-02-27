import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import rehypeSubsectionAnchors from '../plugins/rehype-subsection-anchors.mjs';

async function process(html) {
  const result = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeSubsectionAnchors)
    .use(rehypeStringify)
    .process(html);
  return String(result);
}

describe('rehype-subsection-anchors', () => {
  it('adds id to top-level (a) subsection', async () => {
    const html = '<p><strong>(a) Contents; Amendments.</strong></p>';
    const result = await process(html);
    expect(result).toContain('id="a"');
  });

  it('adds id to (1) nested under (a)', async () => {
    const html = `
      <p><strong>(a) Contents; Amendments.</strong></p>
      <p><strong>(1) Contents.</strong> A summons must:</p>
    `;
    const result = await process(html);
    expect(result).toContain('id="a-1"');
  });

  it('adds id to (A) nested under (a)(1)', async () => {
    const html = `
      <p><strong>(a) Contents.</strong></p>
      <p><strong>(1) General.</strong></p>
      <p><strong>(A)</strong> name the court;</p>
    `;
    const result = await process(html);
    expect(result).toContain('id="a-1-A"');
  });

  it('adds id to (i) nested under (a)(1)(A)', async () => {
    const html = `
      <p><strong>(a) Contents.</strong></p>
      <p><strong>(1) General.</strong></p>
      <p><strong>(A)</strong> items:</p>
      <p><strong>(i)</strong> first item;</p>
    `;
    const result = await process(html);
    expect(result).toContain('id="a-1-A-i"');
  });

  it('resets path when a new top-level label starts', async () => {
    const html = `
      <p><strong>(a) First.</strong></p>
      <p><strong>(b) Second.</strong></p>
    `;
    const result = await process(html);
    expect(result).toContain('id="a"');
    expect(result).toContain('id="b"');
  });

  it('does not add id to plain body text paragraphs', async () => {
    const html = '<p>This is just body text with no label.</p>';
    const result = await process(html);
    expect(result).not.toContain('id=');
  });

  it('does not add id to strong elements not matching a label pattern', async () => {
    const html = '<p><strong>Note:</strong> some important text.</p>';
    const result = await process(html);
    expect(result).not.toContain('id=');
  });

  it('treats (v) as roman numeral (level 4), not lowercase letter (level 1)', async () => {
    const html = `
      <p><strong>(a) Scope.</strong></p>
      <p><strong>(1) General.</strong></p>
      <p><strong>(A)</strong> requirements:</p>
      <p><strong>(v)</strong> fifth item;</p>
    `;
    const result = await process(html);
    expect(result).toContain('id="a-1-A-v"');
    expect(result).not.toContain('id="v"');
  });
});
