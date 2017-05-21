import styles from './components/Event.css';

export const eventTypes = {
  company_presentation: 'Bedriftspresentasjon',
  lunch_presentation: 'Lunsjpresentasjon',
  course: 'Kurs',
  kid_event: 'KID-arrangement',
  party: 'Fest',
  social: 'Sosialt',
  other: 'Annet',
  event: 'Arrangement'
};

export const EVENT_TYPE_TO_STRING = eventType => {
  return eventTypes[eventType] || eventTypes['other'];
};

const typeStyles = {
  company_presentation: styles.companyPresentation,
  lunch_presentation: styles.lunchPresentation,
  course: styles.course,
  party: styles.party,
  social: styles.social,
  event: styles.event,
  other: styles.other
};

export const styleForEvent = eventType => {
  return typeStyles[eventType] || typeStyles['other'];
};
