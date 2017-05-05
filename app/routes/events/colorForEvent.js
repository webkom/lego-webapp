const colors = {
  company_presentation: '#A1C34A',
  lunch_presentation: '#A1C34A',
  course: '#52B0EC',
  party: '#FCD748',
  social: '#B11C11',
  event: '#B11C11',
  other: '#111111'
};
export default function colorForEvent(eventType) {
  return colors[eventType];
}
