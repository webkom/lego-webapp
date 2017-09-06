import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { createEvent } from 'app/actions/EventActions';
import { uploadFile } from 'app/actions/FileActions';
import EventEditor from './components/EventEditor';
import moment from 'moment';

const time = (hours, minutes) =>
  moment().startOf('day').add({ hours, minutes }).toISOString();

const mapStateToProps = (state, props) => {
  const actionGrant = state.events.actionGrant;
  const valueSelector = formValueSelector('eventEditor');
  return {
    initialValues: {
      title: '',
      startTime: time(17, 15),
      endTime: time(20),
      description: '',
      text: '<p></p>',
      eventType: '',
      company: null,
      location: 'TBA',
      isPriced: false,
      useStripe: false,
      priceMember: 0,
      mergeTime: time(12),
      useCaptcha: false,
      pools: []
    },
    actionGrant,
    event: {
      isPriced: valueSelector(state, 'isPriced'),
      eventType: valueSelector(state, 'eventType')
    },
    pools: valueSelector(state, 'pools')
  };
};

const mapDispatchToProps = {
  handleSubmitCallback: createEvent,
  uploadFile
};

export default connect(mapStateToProps, mapDispatchToProps)(EventEditor);
