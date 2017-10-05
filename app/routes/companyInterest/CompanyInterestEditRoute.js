// @flow
import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchSemesters } from 'app/actions/CompanyActions';
import {
  fetchCompanyInterest,
  updateCompanyInterest
} from 'app/actions/CompanyInterestActions';
import CompanyInterestPage, {
  EVENT_TYPES
} from './components/CompanyInterestPage';
import { selectCompanyInterestById } from 'app/reducers/companyInterest';
import { selectCompanySemesters } from 'app/reducers/companySemesters';
import { push } from 'react-router-redux';
import { dispatched } from '@webkom/react-prepare';

const loadCompanyInterests = (props, dispatch) => {
  const { companyInterestId } = props.params;
  return dispatch(fetchSemesters()).then(() =>
    dispatch(fetchCompanyInterest(Number(companyInterestId)))
  );
};

const mapStateToProps = (state, props) => {
  const { companyInterestId } = props.params;
  const companyInterest = selectCompanyInterestById(state, {
    companyInterestId
  });
  if (!companyInterest)
    return {
      edit: true,
      companyInterestId
    };

  const semesters = selectCompanySemesters(state);
  const allEvents = Object.keys(EVENT_TYPES);
  return {
    initialValues: {
      ...companyInterest,
      events: allEvents.map(event => ({
        name: event,
        checked:
          companyInterest.events && companyInterest.events.includes(event)
      })),
      semesters: semesters.map(semester => ({
        ...semester,
        checked:
          companyInterest.semesters &&
          companyInterest.semesters.includes(semester.id)
      }))
    },
    companyInterestId,
    companyInterest,
    edit: true
  };
};

const mapDispatchToProps = (dispatch, { params }) => {
  const id = Number(params.companyInterestId);
  return {
    push: path => dispatch(push(path)),
    onSubmit: data => dispatch(updateCompanyInterest(id, data))
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  dispatched(loadCompanyInterests, {
    componentWillReceiveProps: false
  })
)(CompanyInterestPage);
