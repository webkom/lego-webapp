// @flow

const entityTypeMappings = {
  'events.event': 'events',
  'articles.article': 'articles',
  'quotes.quote': 'quotes',
  'companies.company': 'companies'
};

type ServerName = $Enum<typeof entityTypeMappings>;

export default function getEntityType(serverName: ServerName) {
  return entityTypeMappings[serverName] || serverName;
}
