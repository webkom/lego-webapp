import { EntityType } from 'app/store/models/Entities';

const entityTypeMappings = {
  'events.event': EntityType.Events,
  'articles.article': EntityType.Articles,
  'quotes.quote': EntityType.Quotes,
  'companies.company': EntityType.Companies,
  'meetings.meeting': EntityType.Meetings,
  'gallery.gallerypicture': EntityType.GalleryPictures,
};

export type EntityServerName = keyof typeof entityTypeMappings;

export default function getEntityType(
  serverName: EntityServerName | EntityType
): EntityType {
  return entityTypeMappings[serverName] || serverName;
}
