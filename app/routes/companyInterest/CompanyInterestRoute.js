// @flow
import { connect } from 'react-redux';
import { createCompanyInterest } from 'app/actions/CompanyInterestActions';
import { fetchSemestersForInterestform } from 'app/actions/CompanyActions';
import { compose } from 'redux';
import { push } from 'connected-react-router';
import CompanyInterestPage, {
  EVENT_TYPES,
  OTHER_TYPES
} from './components/CompanyInterestPage';
import { selectCompanySemestersForInterestForm } from 'app/reducers/companySemesters';
import prepare from 'app/utils/prepare';
import { sortSemesterChronologically } from './utils.js';

const loadSemesters = (props, dispatch) =>
  dispatch(fetchSemestersForInterestform());

const mapStateToProps = (state, props) => {
  const semesters = selectCompanySemestersForInterestForm(state);
  const { pathname } = props.location;
  if (!semesters) {
    return {
      edit: false
    };
  }
  const allEvents = Object.keys(EVENT_TYPES);
  const allOtherOffers = Object.keys(OTHER_TYPES);
  const allowedBdb = state.allowed.bdb;

  const language = pathname === '/register-interest' ? 'english' : 'norwegian';
  return {
    allowedBdb,
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
    edit: false,
    language
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
