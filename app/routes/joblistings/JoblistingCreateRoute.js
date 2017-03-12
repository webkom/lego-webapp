// @flow
import { connect } from 'react-redux';
import { createJoblisting } from 'app/actions/JoblistingActions';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import JoblistingEditor
  from 'app/routes/joblistings/components/JoblistingEditor';
import { reduxForm } from 'redux-form';
import { autocomplete } from 'app/actions/SearchActions';
import { selectAutocomplete } from 'app/reducers/search';
import { compose } from 'redux';
import { debounce } from 'lodash';
import moment from 'moment';

function mapDispatchToProps(dispatch) {
  return {
    submitJoblisting: joblisting => dispatch(createJoblisting(joblisting)),
    onQueryChanged: debounce(
      query => dispatch(autocomplete(query, ['companies.company'])),
      30
    )
  };
}

function mapStateToProps(state, props) {
  return {
    results: selectAutocomplete(state),
    initialValues: {
      fromYear: 1,
      toYear: 5,
      jobType: 'summer_job',
      deadline: moment().utc().format('YYYY-MM-DD[T]HH:MM:SS[Z]'),
      visibleFrom: moment().utc().format('YYYY-MM-DD[T]HH:MM:SS[Z]'),
      visibleTo: moment()
        .add(2, 'months')
        .utc()
        .format('YYYY-MM-DD[T]HH:MM:SS[Z]')
    }
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['loggedIn'])
)(JoblistingEditor);
