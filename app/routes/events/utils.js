export const EVENT_TYPE_TO_STRING = eventType => {
  const eventTypes = {
    company_presentation: 'Bedriftspresentasjon',
    lunch_presentation: 'Lunsjpresentasjon',
    course: 'Kurs',
    kid_event: 'KID-arrangement',
    party: 'Fest',
    social: 'Sosialt',
    other: 'Annet',
    event: 'Arrangement'
  };
  return eventTypes[eventType] || eventTypes['other'];
};
