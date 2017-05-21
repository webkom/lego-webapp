import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { createEvent } from 'app/actions/EventActions';
import { uploadFile } from 'app/actions/FileActions';
import EventEditor from './components/EventEditor';
import { autocomplete } from 'app/actions/SearchActions';
import { selectAutocomplete } from 'app/reducers/search';
import { debounce } from 'lodash';
import moment from 'moment';

const time = moment().toISOString();

const mapStateToProps = (state, props) => {
  const actionGrant = state.events.actionGrant;
  const valueSelector = formValueSelector('eventEditor');
  return {
    initialValues: {
      title: '',
      startTime: time,
      endTime: time,
      description: '',
      text: '<p></p>',
      eventType: '',
      company: {},
      location: 'TBA',
      isPriced: false,
      useStripe: false,
      priceMember: 0,
      mergeTime: time,
      useCaptcha: false,
      pools: []
    },
    actionGrant,
    event: {
      isPriced: valueSelector(state, 'isPriced'),
      eventType: valueSelector(state, 'eventType')
    },
    pools: valueSelector(state, 'pools'),
    searching: state.search.searching,
    autocompleteResult: selectAutocomplete(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators(
      {
        handleSubmitCallback: createEvent,
        uploadFile
      },
      dispatch
    ),
    companyQueryChanged: debounce(
      query => dispatch(autocomplete(query, ['companies.company'])),
      30
    ),
    groupQueryChanged: debounce(
      query => dispatch(autocomplete(query, ['users.abakusgroup'])),
      30
    )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventEditor);
