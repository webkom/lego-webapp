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
import { dispatched } from 'react-prepare';

const loadCompanyInterests = (props, dispatch) => {
  const { companyInterestId } = props.params;
  return dispatch(fetchSemesters()).then(() =>
    dispatch(fetchCompanyInterest(Number(companyInterestId)))
  );
};

const mapStateToProps = (state, props) => {
  const { companyInterestId } = props.params;
  const company = selectCompanyInterestById(state, { companyInterestId });
  const semesters = selectCompanySemesters(state);
  const allEvents = Object.keys(EVENT_TYPES);
  return {
    initialValues: {
      ...company,
      events: allEvents.map(event => ({
        name: event,
        checked: company.events && company.events.includes(event)
      })),
      semesters: semesters.map(semester => ({
        ...semester,
        checked: company.semesters && company.semesters.includes(semester.id)
      }))
    },
    companyInterestId,
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
