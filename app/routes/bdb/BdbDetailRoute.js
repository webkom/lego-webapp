import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
import {
  fetch,
  deleteSemesterStatus,
  deleteCompanyContact
} from 'app/actions/CompanyActions';
import BdbDetail from './components/BdbDetail';
import { compose } from 'redux';
import {
  selectCompanyById,
  selectEventsForCompany,
  selectCommentsForCompany
} from 'app/reducers/companies';

const mapStateToProps = (state, props) => {
  const companyId = props.params.companyId;
  const company = selectCompanyById(state, { companyId });
  const comments = selectCommentsForCompany(state, { companyId });
  const companyEvents = selectEventsForCompany(state, { companyId });
  return {
    company,
    companyId,
    companyEvents,
    comments
  };
};

const mapDispatchToProps = {
  fetch,
  deleteSemesterStatus,
  deleteCompanyContact
};

export default compose(
  dispatched(
    ({ params: { companyId } }, dispatch) => dispatch(fetch(companyId)),
    {
      componentWillReceiveProps: false
    }
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(BdbDetail);
