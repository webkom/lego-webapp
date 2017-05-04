import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
import { fetchEvent } from 'app/actions/EventActions';
import { selectEventById } from 'app/reducers/events';
import EventEditor from './components/EventEditor';

export default compose()(EventEditor);
