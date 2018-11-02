// @flow
import { connect } from 'react-redux';
import { createCompanyInterest } from 'app/actions/CompanyInterestActions';
import { fetchSemestersForInterestform } from 'app/actions/CompanyActions';
import { compose } from 'redux';
import { push } from 'react-router-redux';
import CompanyInterestPage, {
  EVENT_TYPES,
  OTHER_TYPES
} from './components/CompanyInterestPage';
import { selectCompanySemestersForInterestForm } from 'app/reducers/companySemesters';
import prepare from 'app/utils/prepare';
import { sortSemesterChronologically } from './utils.js';

const loadSemesters = (props, dispatch) =>
  dispatch(fetchSemestersForInterestform());

const mapStateToProps = state => {
  const semesters = selectCompanySemestersForInterestForm(state);
  if (!semesters) {
    return {
      edit: false
    };
  }
  const allEvents = Object.keys(EVENT_TYPES);
  const allOtherOffers = Object.keys(OTHER_TYPES);
  const actionGrant = state.companyInterest.actionGrant;
  return {
    actionGrant,
    initialValues: {
      events: allEvents.map(event => ({
        name: event,
        checked: false
      })),
      otherOffers: allOtherOffers.map(offer => ({
        name: offer,
        checked: false
      })),
      semesters: semesters.sort(sortSemesterChronologically)
    },
    edit: false
  };
};

const mapDispatchToProps = {
  push,
  onSubmit: createCompanyInterest
};

export default compose(
  prepare(loadSemesters),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(CompanyInterestPage);
