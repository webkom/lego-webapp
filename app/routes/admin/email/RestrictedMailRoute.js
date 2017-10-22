// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import loadingIndicator from 'app/utils/loadingIndicator';
import RestrictedMailEditor from './components/RestrictedMailEditor';
import {
  fetchRestrictedMail,
  fetchRestrictedMailToken
} from 'app/actions/restrictedMailActions';
import { selectRestrictedMailById } from 'app/reducers/restrictedMails';
import prepare from 'app/utils/prepare';

const mapStateToProps = (state, { routeParams }) => {
  const restrictedMail = selectRestrictedMailById(state, {
    restrictedMailId: routeParams.restrictedMailId
  });

  return {
    restrictedMail,
    restrictedMailId: routeParams.restrictedMailId,
    fetching: state.restrictedMails.fetching,
    initialValues: {
      ...restrictedMail,
      groups: (restrictedMail.groups || []).map(groups => ({
        label: groups.name,
        value: groups.id
      })),
      meetings: (restrictedMail.meetings || []).map(meeting => ({
        label: meeting.name,
        value: meeting.id
      })),
      events: (restrictedMail.events || []).map(event => ({
        label: event.title,
        value: event.id
      })),
      rawAddresses: (restrictedMail.rawAddresses || []).map(rawAddresses => ({
        label: rawAddresses,
        value: rawAddresses
      })),
      users: (restrictedMail.users || []).map(user => ({
        label: user.fullName,
        value: user.id
      }))
    }
  };
};

const mapDispatchToProps = { fetchRestrictedMailToken };

const loadData = ({ params }, dispatch) =>
  dispatch(fetchRestrictedMail(params.restrictedMailId));

export default compose(
  prepare(loadData, ['params.restrictedMailId']),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['restrictedMail.id'])
)(RestrictedMailEditor);
