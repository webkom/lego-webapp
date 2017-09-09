// @flow
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import {
  updateInterestGroup,
  joinInterestGroup
} from 'app/actions/InterestGroupActions';
import InterestGroupEdit from './components/InterestGroupEdit';
import { uploadFile } from 'app/actions/FileActions';

const mapDispatchToProps = {
  updateInterestGroup,
  joinInterestGroup,
  uploadFile
};

const mapStateToProps = (state, props) => {
  const valueSelector = formValueSelector('interestGroupEdit');
  const interestGroup = state.interestGroups.byId[props.params.interestGroupId];
  console.log(state.interestGroups);
  return {
    group: interestGroup,
    initialValues: {
      descriptionLong: '<p></p>'
      // ...interestGroup
    },
    invitedMembers: valueSelector(state, 'members') || []
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(InterestGroupEdit);
