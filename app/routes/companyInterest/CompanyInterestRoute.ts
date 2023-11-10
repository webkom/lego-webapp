import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { formValueSelector } from 'redux-form';
import { fetchSemestersForInterestform } from 'app/actions/CompanyActions';
import { createCompanyInterest } from 'app/actions/CompanyInterestActions';
import { selectCompanySemestersForInterestForm } from 'app/reducers/companySemesters';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import CompanyInterestPage from './components/CompanyInterestPage';
import {
  COLLABORATION_TYPES,
  EVENTS,
  README,
  SURVEY_OFFERS,
  TARGET_GRADES,
} from './components/Translations';

import { sortSemesterChronologically } from './utils';

const valueSelector = formValueSelector('CompanyInterestForm');

const mapStateToProps = (state, props) => {
  const semesters = selectCompanySemestersForInterestForm(state);
  const { pathname } = props.location;

  if (!semesters) {
    return {
      edit: false,
    };
  }

  const allEvents = Object.keys(EVENTS);
  const allOtherOffers = Object.keys(README);
  const allCollaborations = Object.keys(COLLABORATION_TYPES);
  const allTargetGrades = Object.keys(TARGET_GRADES);
  const allSurveyOffers = Object.keys(SURVEY_OFFERS);
  const allowedBdb = state.allowed.bdb;
  const language = pathname === '/register-interest' ? 'english' : 'norwegian';
  return {
    allowedBdb,
    initialValues: {
      events: allEvents.map((event) => ({
        name: event,
        checked: false,
      })),
      companyCourseThemes: allSurveyOffers.map((offer) => ({
        name: offer,
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
      companyType: null,
      officeInTrondheim: null,
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
  withPreparedDispatch('fetchCompanyInterest', (props, dispatch) =>
    dispatch(fetchSemestersForInterestform()),
  ),
  connect(mapStateToProps, mapDispatchToProps),
)(CompanyInterestPage);
