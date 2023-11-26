export type SignedPost = {
  fields: {
    'Content-Type': string;
    acl: string;
    key: string;
    policy: string;
    success_action_redirect: string;
    'x-amz-algorithm': string;
    'x-amz-credential': string;
    'x-amz-date': string;
    'x-amz-signature': string;
  };
  file_key: string;
  file_token: string;
  url: string;
};
