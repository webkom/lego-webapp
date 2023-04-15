import { useUserContext } from 'app/routes/app/AppRoute';

type Data = {
  username?: string;
  firstName?: string;
  lastName?: string;
};
export const validPassword =
  (message = 'Passordet er for svakt. Minimum styrke er 3.') =>
  async (value: string, data: Data) => {
    if (value === undefined) {
      return [true];
    }

    const zxcvbn = (await import('zxcvbn')).default;
    const userValues = [data.username, data.firstName, data.lastName].filter(
      Boolean
    );
    const evalPass = zxcvbn(value, userValues);
    return [evalPass.score >= 3, message];
  };

export const isCurrentUser = (username: string, currentUsername: string) =>
  username === 'me' || username === currentUsername;

export const useIsCurrentUser = (username: string) => {
  const { currentUser } = useUserContext();
  return isCurrentUser(username, currentUser.username);
};
