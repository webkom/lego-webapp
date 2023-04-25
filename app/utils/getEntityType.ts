import type { $Keys } from 'utility-types';

const entityTypeMappings = {
  'events.event': 'events',
  'articles.article': 'articles',
  'quotes.quote': 'quotes',
  'companies.company': 'companies',
  'meetings.meeting': 'meetings',
  'gallery.gallerypicture': 'galleryPictures',
};
type ServerName = $Keys<typeof entityTypeMappings>;
export default function getEntityType(serverName: ServerName): string {
  return entityTypeMappings[serverName] || serverName;
}
