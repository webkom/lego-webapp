import React from 'react';
import LoadingIndicator from 'app/components/LoadingIndicator';

export const MeetingAnswer = ({ response, user, meeting, status }) => {
  if (!response) {
    return <LoadingIndicator loading />;
  }

  if (response === 'SUCCESS') {
    const statusText = ['', 'Delta', 'Ikke delta'][status];
    return (
      <div style={{ textAlign: 'center' }}>
        <h1> Du har nå svart på invitasjonen 😃 </h1>
        <p>
          {' '}{user.firstName} skal nå {statusText} på møtet!
        </p>
        <p>
          Logg inn og sjekk møtet <a href={`/meetings/${meeting}/`}> her</a>
        </p>
      </div>
    );
  }
  return (
    <div style={{ textAlign: 'center' }}>
      <h1> Det har skjedd en feil :( </h1>
      <p> Prøv å logg inn for å svare på invitasjonen </p>
    </div>
  );
};

export default MeetingAnswer;
