const entityTypeMappings = {
  'events.event': 'events'
};

export default function getEntityType(serverName) {
  return entityTypeMappings[serverName] || serverName;
}
