import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { formValueSelector } from 'redux-form';
import { fetchSemesters } from 'app/actions/CompanyActions';
import {
  fetchCompanyInterest,
  updateCompanyInterest,
} from 'app/actions/CompanyInterestActions';
import { selectCompanyInterestById } from 'app/reducers/companyInterest';
import { selectAllCompanySemesters } from 'app/reducers/companySemesters';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import CompanyInterestPage, {
  COLLABORATION_TYPES,
  EVENT_TYPES,
  OTHER_TYPES,
  PARTICIPANT_RANGE_MAP,
  SURVEY_OFFER_TYPES,
  TARGET_GRADE_TYPES,
} from './components/CompanyInterestPage';
import { sortSemesterChronologically } from './utils';

const valueSelector = formValueSelector('CompanyInterestForm');

const mapStateToProps = (state, props) => {
  const { companyInterestId } = props.match.params;
  const companyInterest = selectCompanyInterestById(state, companyInterestId);
  const semesters = selectAllCompanySemesters(state);
  if (!companyInterest || !semesters)
    return {
      edit: true,
      companyInterestId,
    };
  const allEvents = Object.keys(EVENT_TYPES);
  const allOtherOffers = Object.keys(OTHER_TYPES);
  const allCollaborations = Object.keys(COLLABORATION_TYPES);
  const allTargetGrades = Object.keys(TARGET_GRADE_TYPES);
  const allParticipantRanges = Object.keys(PARTICIPANT_RANGE_MAP);
  const allSurveyOffers = Object.keys(SURVEY_OFFER_TYPES);
  const allowedBdb = state.allowed.bdb;
  const participantRange =
    allParticipantRanges.filter(
      (p) =>
        PARTICIPANT_RANGE_MAP[p][0] === companyInterest.participantRangeStart
    ) || null;

  return {
    allowedBdb,
    initialValues: {
      ...companyInterest,
      company: companyInterest.company
        ? {
            label: companyInterest.company.name,
            title: companyInterest.company.name,
            value: '' + companyInterest.company.id,
          }
        : {
            label: companyInterest.companyName,
            title: companyInterest.companyName,
          },
      events: allEvents.map((event) => ({
        name: event,
        checked:
          companyInterest.events && companyInterest.events.includes(event),
      })),
      companyCourseThemes: allSurveyOffers.map((offer) => ({
        name: offer,
        checked:
          companyInterest.companyCourseThemes &&
          companyInterest.companyCourseThemes.includes(offer),
      })),
      otherOffers: allOtherOffers.map((offer) => ({
        name: offer,
        checked:
          companyInterest.otherOffers &&
          companyInterest.otherOffers.includes(offer),
      })),
      collaborations: allCollaborations.map((collab) => ({
        name: collab,
        checked:
          companyInterest.collaborations &&
          companyInterest.collaborations.includes(collab),
      })),
      targetGrades: allTargetGrades.map((targetGrade) => ({
        name: targetGrade,
        checked:
          companyInterest.targetGrades &&
          companyInterest.targetGrades.includes(Number(targetGrade)),
      })),
      participantRange: (participantRange && participantRange[0]) || null,
      officeInTrondheim: companyInterest.officeInTrondheim ? 'yes' : 'no',
      semesters: semesters
        .map((semester) => ({
          ...semester,
          checked:
            companyInterest.semesters &&
            companyInterest.semesters.includes(semester.id),
        }))
        .filter((semester) => semester.activeInterestForm || semester.checked)
        .sort(sortSemesterChronologically),
    },
    companyInterestId,
    companyInterest,
    interestForm: {
      events: valueSelector(state, 'events'),
    },
    edit: true,
    language: 'norwegian',
  };
};

const mapDispatchToProps = (dispatch, { match: { params } }) => {
  const id = Number(params.companyInterestId);
  return {
    push: (path) => dispatch(push(path)),
    onSubmit: (data) => dispatch(updateCompanyInterest(id, data)),
  };
};

export default compose(
  withPreparedDispatch('fetchCompanyInterestEdit', (props, dispatch) =>
    Promise.all([
      dispatch(fetchSemesters()),
      dispatch(fetchCompanyInterest(props.match.params.companyInterestId)),
    ])
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(CompanyInterestPage);
