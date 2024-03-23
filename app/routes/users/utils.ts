import { useCurrentUser } from 'app/reducers/auth';

type Data = {
  username?: string;
  firstName?: string;
  lastName?: string;
};
export const validPassword =
  (message = 'Passordet er for svakt. Minimum styrke er 3.') =>
  async (value: string, data: Data) => {
    if (value === undefined) {
      return [true] as const;
    }

    const zxcvbn = (await import('zxcvbn')).default;
    const userValues = [data.username, data.firstName, data.lastName].filter(
      Boolean,
    );
    const evalPass = zxcvbn(value, userValues);
    return [evalPass.score >= 3, message] as const;
  };

export const isCurrentUser = (username?: string, currentUsername?: string) => {
  if (!username) return false;

  return username === 'me' || username === currentUsername;
};

export const useIsCurrentUser = (username?: string) => {
  const currentUser = useCurrentUser();
  return isCurrentUser(username, currentUser?.username);
};
