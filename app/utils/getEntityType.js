// @flow

const entityTypeMappings = {
  'events.event': 'events'
};

type ServerName = $Enum<typeof entityTypeMappings>;

export default function getEntityType(serverName: ServerName) {
  return entityTypeMappings[serverName] || serverName;
}
