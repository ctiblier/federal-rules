import { getCollection } from 'astro:content';

export async function getCollectionByName(name: string) {
  switch (name) {
    case 'civil': return getCollection('civil');
    case 'criminal': return getCollection('criminal');
    case 'appellate': return getCollection('appellate');
    case 'evidence': return getCollection('evidence');
    case 'bankruptcy': return getCollection('bankruptcy');
    default: throw new Error(`Unknown collection: ${name}`);
  }
}
