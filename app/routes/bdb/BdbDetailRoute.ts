import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { deleteComment } from 'app/actions/CommentActions';
import {
  fetchAdmin,
  deleteSemesterStatus,
  deleteCompanyContact,
  fetchSemesters,
  editSemesterStatus,
  fetchEventsForCompany,
  editCompany,
  deleteCompany,
} from 'app/actions/CompanyActions';
import { LoginPage } from 'app/components/LoginForm';
import {
  selectCompanyById,
  selectEventsForCompany,
  selectCommentsForCompany,
} from 'app/reducers/companies';
import { selectCompanySemesters } from 'app/reducers/companySemesters';
import { selectPagination, selectPaginationNext } from 'app/reducers/selectors';
import { EntityType } from 'app/store/models/entities';
import createQueryString from 'app/utils/createQueryString';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import BdbDetail from './components/BdbDetail';
import type { ID } from 'app/store/models';

const getQuery = (companyId: ID) => ({
  company: String(companyId),
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
        query: getQuery(companyId),
        next: false,
      })
    ),
  ]);

const mapStateToProps = (state, props) => {
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
  const companySemesters = selectCompanySemesters(state, props);
  const fetching = state.companies.fetching;
  const showFetchMoreEvents = selectPaginationNext({
    entity: EntityType.Events,
    endpoint: '/events/',
    query: getQuery(companyId),
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
        query: getQuery(companyId),
        next: true,
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
