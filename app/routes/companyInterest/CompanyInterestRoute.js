// @flow
import { connect } from 'react-redux';
import { createCompanyInterest } from 'app/actions/CompanyInterestActions';
import { fetchSemestersForInterestform } from 'app/actions/CompanyActions';
import { compose } from 'redux';
import { formValueSelector } from 'redux-form';
import { push } from 'connected-react-router';
import CompanyInterestPage, {
  EVENT_TYPES,
  OTHER_TYPES,
  COLLABORATION_TYPES,
  TARGET_GRADE_TYPES,
} from './components/CompanyInterestPage';
import { selectCompanySemestersForInterestForm } from 'app/reducers/companySemesters';
import prepare from 'app/utils/prepare';
import { sortSemesterChronologically } from './utils.js';

const loadSemesters = (props, dispatch) =>
  dispatch(fetchSemestersForInterestform());

const valueSelector = formValueSelector('CompanyInterestForm');

const mapStateToProps = (state, props) => {
  const semesters = selectCompanySemestersForInterestForm(state);
  const { pathname } = props.location;
  if (!semesters) {
    return {
      edit: false,
    };
  }
  const allEvents = Object.keys(EVENT_TYPES);
  const allOtherOffers = Object.keys(OTHER_TYPES);
  const allCollaborations = Object.keys(COLLABORATION_TYPES);
  const allTargetGrades = Object.keys(TARGET_GRADE_TYPES);
  const allowedBdb = state.allowed.bdb;

  const language = pathname === '/register-interest' ? 'english' : 'norwegian';
  return {
    allowedBdb,
    initialValues: {
      events: allEvents.map((event) => ({
        name: event,
        checked: false,
      })),
      otherOffers: allOtherOffers.map((offer) => ({
        name: offer,
        checked: false,
      })),
      collaborations: allCollaborations.map((collab) => ({
        name: collab,
        checked: false,
      })),
      targetGrades: allTargetGrades.map((targetGrade) => ({
        name: targetGrade,
        checked: false,
      })),
      participantRange: null,
      semesters: semesters.sort(sortSemesterChronologically),
    },
    interestForm: {
      events: valueSelector(state, 'events'),
    },
    edit: false,
    language,
  };
};

const mapDispatchToProps = {
  push,
  onSubmit: createCompanyInterest,
};

export default compose(
  prepare(loadSemesters),
  connect(mapStateToProps, mapDispatchToProps)
)(CompanyInterestPage);
