export function InvalidTokenError(err) {
  return err.status === 400 &&
    err.body.non_field_errors &&
    err.body.non_field_errors[0] === 'Error decoding signature.';
};
