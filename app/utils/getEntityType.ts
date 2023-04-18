import type { $Keys } from 'utility-types';

const entityTypeMappings = {
  'events.event': 'events',
  'articles.article': 'articles',
  'quotes.quote': 'quotes',
  'companies.company': 'companies',
  'meetings.meeting': 'meetings',
  'gallery.gallerypicture': 'galleryPictures',
};
export type EntityServerName = $Keys<typeof entityTypeMappings>;
export default function getEntityType(serverName: EntityServerName): string {
  return entityTypeMappings[serverName] || serverName;
}
