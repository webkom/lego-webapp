import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { deleteComment } from 'app/actions/CommentActions';
import {
  deleteCompany,
  deleteCompanyContact,
  deleteSemesterStatus,
  editCompany,
  editSemesterStatus,
  fetchAdmin,
  fetchEventsForCompany,
  fetchSemesters,
} from 'app/actions/CompanyActions';
import { LoginPage } from 'app/components/LoginForm';
import {
  selectCommentsForCompany,
  selectCompanyById,
  selectEventsForCompany,
} from 'app/reducers/companies';
import { selectAllCompanySemesters } from 'app/reducers/companySemesters';
import { selectPagination } from 'app/reducers/selectors';
import type { RootState } from 'app/store/createRootReducer';
import createQueryString from 'app/utils/createQueryString';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import BdbDetail from './components/BdbDetail';
import type { EntityId } from '@reduxjs/toolkit';

const queryString = (companyId: EntityId) =>
  createQueryString({
    company: companyId,
    ordering: '-start_time',
  });

const loadData = (
  {
    match: {
      params: { companyId },
    },
  },
  dispatch
) =>
  Promise.all([
    dispatch(fetchSemesters()).then(() => dispatch(fetchAdmin(companyId))),
    dispatch(
      fetchEventsForCompany({
        queryString: queryString(companyId),
        loadNextPage: false,
      })
    ),
  ]);

const mapStateToProps = (state: RootState, props) => {
  const companyId = Number(props.match.params.companyId);
  const company = selectCompanyById(state, {
    companyId,
  });
  const comments = selectCommentsForCompany(state, {
    companyId,
  });
  const companyEvents = selectEventsForCompany(state, {
    companyId,
  });
  const companySemesters = selectAllCompanySemesters(state);
  const fetching = state.companies.fetching;
  const showFetchMoreEvents = selectPagination('events', {
    queryString: queryString(companyId),
  })(state);
  return {
    company,
    companyId,
    companyEvents,
    comments,
    companySemesters,
    fetching,
    showFetchMoreEvents,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  const { companyId } = props.match.params;

  const fetchMoreEvents = () =>
    dispatch(
      fetchEventsForCompany({
        queryString: queryString(companyId),
        loadNextPage: true,
      })
    );

  return {
    ...bindActionCreators(
      {
        deleteSemesterStatus,
        deleteCompanyContact,
        editSemesterStatus,
        editCompany,
        deleteCompany,
        deleteComment,
      },
      dispatch
    ),
    fetchMoreEvents,
  };
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  withPreparedDispatch('withBdbDetail', loadData, (props) => [
    props.match.params.companyId,
  ]),
  connect(mapStateToProps, mapDispatchToProps)
)(BdbDetail);
