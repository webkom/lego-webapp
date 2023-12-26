import { LoadingIndicator, Button } from '@webkom/lego-bricks';
import { useNavigate } from 'react-router-dom';
import { resetMeetingsToken } from 'app/actions/MeetingActions';
import { useAppDispatch } from 'app/store/hooks';
import { MeetingInvitationStatus } from 'app/store/models/MeetingInvitation';
import type { MeetingsTokenResponse } from 'app/reducers/meetingsToken';
import type { ID } from 'app/store/models';
import type { PublicUser } from 'app/store/models/User';

type Props = {
  response: MeetingsTokenResponse;
  user: PublicUser;
  status: MeetingInvitationStatus;
  meeting: ID;
};

const statusTexts: { [value in MeetingInvitationStatus]: string } = {
  [MeetingInvitationStatus.Attending]: 'skal nå delta',
  [MeetingInvitationStatus.NotAttending]: 'skal nå ikke delta',
  [MeetingInvitationStatus.NoAnswer]: 'har nå ikke svart på om de skal delta',
};

const MeetingAnswer = ({ response, user, meeting, status }: Props) => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  if (!response) {
    return <LoadingIndicator loading />;
  }

  const handleLink = () => {
    navigate(`/meetings/${meeting}`);
    dispatch(resetMeetingsToken());
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
          <Button dark onClick={handleLink}>
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
      <Button onClick={handleLink}>Logg inn</Button>
    </div>
  );
};

export default MeetingAnswer;
