import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import LoadingIndicator from 'app/components/LoadingIndicator';

function mapStateToProps(state, props) {
  const { status, user, meeting, answer } = props.location.query;
  return {
    status,
    user,
    meeting,
    answer
  };
}

function returnStatus({ status, user, meeting, answer }) {
  if (!status) {
    return <LoadingIndicator loading />;
  }

  if (status === 'good') {
    const answerText = ['', 'Delta', 'Ikke delta'][answer];
    return (
      <div style={{ textAlign: 'center' }}>
        <h1> Du har nå svart på invitasjonen 😃 </h1>
        <p>
          {' '}{user} skal nå {answerText} på møtet!
        </p>
        <p>
          {' '}Link: <a href={`/meetings/${meeting}/`}> her </a>{' '}
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
}

export default compose(connect(mapStateToProps, null))(returnStatus);
