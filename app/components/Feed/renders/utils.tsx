import joinValues from 'app/utils/joinValues';

export function formatHeader(values: Array<any>) {
  if (values.length === 3) {
    values = values.slice(0, 2);
    values.push('en annen');
    return joinValues(values);
  } else if (values.length > 3) {
    const rest = values.length - 2;
    values = values.slice(0, 2);
    values.push(`${rest} andre`);
    return joinValues(values);
  }
  return joinValues(values);
}
