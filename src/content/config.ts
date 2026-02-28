// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const ruleSchema = z.object({
  rule: z.string(),
  title: z.string(),
  title_number: z.string(),
  title_name: z.string(),
  summary: z.string().optional().default(''),
  keywords: z.array(z.string()).default([]),
  related_rules: z.array(z.string()).default([]),
  last_amended: z.string(),
  has_deadlines: z.boolean(),
  source_pdf_url: z.string().url(),
  source_pdf_page: z.number(),
  versions: z.array(z.string()),
});

const rulesCollection = defineCollection({ type: 'content', schema: ruleSchema });

export const collections = {
  civil: rulesCollection,
  criminal: rulesCollection,
};
