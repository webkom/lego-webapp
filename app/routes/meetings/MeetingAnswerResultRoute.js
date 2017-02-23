import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
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


function returnWait({status}) {
  return (
    <div>
      Fuuu
      {status}
    </div>

  );
}

export default compose(
  connect(mapStateToProps, null),
  //fetchOnUpdate(['status', 'token'], loadData),
)(returnWait);
