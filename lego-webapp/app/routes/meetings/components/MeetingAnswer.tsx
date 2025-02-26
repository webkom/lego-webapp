import { LoadingIndicator, Button } from '@webkom/lego-bricks';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '~/redux/hooks';
import { MeetingInvitationStatus } from '~/redux/models/MeetingInvitation';
import { resetMeetingToken } from '~/redux/slices/meetings';
import type { MeetingTokenSuccessState } from '~/redux/slices/meetings';

const statusTexts: { [value in MeetingInvitationStatus]: string } = {
  [MeetingInvitationStatus.Attending]: 'skal nå delta',
  [MeetingInvitationStatus.NotAttending]: 'skal nå ikke delta',
  [MeetingInvitationStatus.NoAnswer]: 'har nå ikke svart på om de skal delta',
};

const MeetingAnswer = ({
  response,
  user,
  meeting,
  status,
}: MeetingTokenSuccessState) => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  if (!response) {
    return <LoadingIndicator loading />;
  }

  const handleLink = () => {
    navigate(`/meetings/${meeting}`);
    dispatch(resetMeetingToken());
  };

  if (response === 'SUCCESS') {
    const statusText = statusTexts[status];
    return (
      <div
        style={{
          textAlign: 'center',
        }}
      >
        <h1>
          Du har nå svart på invitasjonen{' '}
          <span role="img" aria-label="happy">
            😃
          </span>
        </h1>
        <p>
          {user.firstName} {statusText} på møtet!
        </p>
        <p>
          <Button dark onPress={handleLink}>
            Logg inn og sjekk møtet
          </Button>
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
      <Button onPress={handleLink}>Logg inn</Button>
    </div>
  );
};

export default MeetingAnswer;
