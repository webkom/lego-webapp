import LoadingIndicator from 'app/components/LoadingIndicator';
import type { User } from 'app/models';

type Props = {
  response: string | null | undefined;
  user: User;
  status: number;
  resetMeetingsToken: () => void;
  meeting: number;
  router: /*TODO: Router*/ Record<string, any>;
};

const MeetingAnswer = ({
  response,
  user,
  meeting,
  status,
  router,
  resetMeetingsToken,
}: Props) => {
  if (!response) {
    return <LoadingIndicator loading />;
  }

  const handleLink = () => {
    router.push(`/meetings/${meeting}`);
    resetMeetingsToken();
  };

  if (response === 'SUCCESS') {
    const statusText = ['', 'Delta', 'Ikke delta'][status];
    return (
      <div
        style={{
          textAlign: 'center',
        }}
      >
        <h1>
          {' '}
          Du har nå svart på invitasjonen{' '}
          <span role="img" aria-label="happy">
            😃
          </span>
        </h1>
        <p>
          {user.firstName} skal nå {statusText} på møtet!
        </p>
        <p>
          Logg inn og sjekk møtet <button onClick={handleLink}> her</button>
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        textAlign: 'center',
      }}
    >
      <h1>Det har skjedd en feil :(</h1>
      <p>Prøv å logg inn for å svare på invitasjonen</p>
    </div>
  );
};

export default MeetingAnswer;
