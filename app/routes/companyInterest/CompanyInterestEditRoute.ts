// @flow
import { compose } from 'redux';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { fetchSemesters } from 'app/actions/CompanyActions';
import {
  fetchCompanyInterest,
  updateCompanyInterest,
} from 'app/actions/CompanyInterestActions';
import CompanyInterestPage, {
  COLLABORATION_TYPES,
  EVENT_TYPES,
  OTHER_TYPES,
  TARGET_GRADE_TYPES,
  PARTICIPANT_RANGE_MAP,
} from './components/CompanyInterestPage';
import { selectCompanyInterestById } from 'app/reducers/companyInterest';
import { selectCompanySemesters } from 'app/reducers/companySemesters';
import { sortSemesterChronologically } from './utils.js';
import { push } from 'connected-react-router';
import prepare from 'app/utils/prepare';

const loadCompanyInterests = (props, dispatch) => {
  const { companyInterestId } = props.match.params;
  return dispatch(fetchSemesters()).then(() =>
    dispatch(fetchCompanyInterest(Number(companyInterestId)))
  );
};

const valueSelector = formValueSelector('CompanyInterestForm');

const mapStateToProps = (state, props) => {
  const { companyInterestId } = props.match.params;
  const companyInterest = selectCompanyInterestById(state, {
    companyInterestId,
  });

  const semesters = selectCompanySemesters(state);
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
  prepare(loadCompanyInterests),
  connect(mapStateToProps, mapDispatchToProps)
)(CompanyInterestPage);
