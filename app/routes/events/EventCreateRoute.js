import { connect } from 'react-redux';
import { compose } from 'redux';
import { formValueSelector } from 'redux-form';
import { createEvent } from 'app/actions/EventActions';
import { uploadFile } from 'app/actions/FileActions';
import EventEditor from './components/EventEditor';
import {
  selectEventById,
  selectPoolsWithRegistrationsForEvent
} from 'app/reducers/events';
import { LoginPage } from 'app/components/LoginForm';
import { transformEvent } from './utils';
import time from 'app/utils/time';
import prepare from 'app/utils/prepare';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { isEmpty } from 'lodash';
import { fetchEvent } from 'app/actions/EventActions';
import loadingIndicator from 'app/utils/loadingIndicator';
import moment from 'moment-timezone';

const mapStateToProps = (state, props) => {
  console.log(props);
  const actionGrant = state.events.actionGrant;
  const valueSelector = formValueSelector('eventEditor');
  const eventId = props.match.params.id;

  const eventTemplate = selectEventById(state, { eventId });
  const poolsTemplate = selectPoolsWithRegistrationsForEvent(state, {
    eventId
  });

  const selectedValues = {
    event: {
      addFee: valueSelector(state, 'addFee'),
      isPriced: valueSelector(state, 'isPriced'),
      feedbackRequired: valueSelector(state, 'feedbackRequired'),
      heedPenalties: valueSelector(state, 'heedPenalties'),
      useStripe: valueSelector(state, 'useStripe'),
      eventType: valueSelector(state, 'eventType'),
      priceMember: valueSelector(state, 'priceMember'),
      startTime: valueSelector(state, 'startTime'),
      eventStatusType: valueSelector(state, 'eventStatusType'),
      registrationDeadline:
        valueSelector(state, 'startTime') &&
        moment(valueSelector(state, 'startTime')).subtract(
          valueSelector(state, 'registrationDeadlineHours'),
          'hours'
        )
    },
    pools: valueSelector(state, 'pools')
  };

  const initialCreateValues = {
    initialValues: {
      title: '',
      startTime: time({ hours: 17, minutes: 15 }),
      endTime: time({ hours: 20, minutes: 15 }),
      description: '',
      text: '',
      eventType: '',
      eventStatusType: 'TBA',
      company: null,
      responsibleGroup: null,
      location: '',
      isPriced: false,
      useStripe: true,
      priceMember: 0,
      paymentDueDate: time({ days: 7, hours: 17, minutes: 15 }),
      mergeTime: time({ hours: 12 }),
      useCaptcha: true,
      heedPenalties: true,
      isAbakomOnly: false,
      useConsent: false,
      feedbackDescription: '',
      pools: [],
      unregistrationDeadline: time({ hours: 12 }),
      registrationDeadlineHours: 2
    },
    actionGrant,
    ...selectedValues
  };

  /* If there is no eventId in the params then we use the
   * normal initalValues for a new event
   */
  if (!eventId) return initialCreateValues;

  /* This will set the initalvalues as NULL if there is an
   * eventID but the template is empty. This means the template
   * is yet to be loaded. We return NULL to prevent the initial
   * values to be set to default
   */
  if (isEmpty(eventTemplate) && eventId) {
    return { initialValues: null };
  }

  return {
    initialValues: {
      ...eventTemplate,
      mergeTime: eventTemplate.mergeTime
        ? eventTemplate.mergeTime
        : time({ hours: 12 }),
      priceMember: eventTemplate.priceMember / 100,
      pools: poolsTemplate.map(pool => ({
        activationDate: pool.activationDate,
        capacity: pool.capacity,
        name: pool.name,
        registrations: [],
        permissionGroups: (pool.permissionGroups || []).map(group => ({
          label: group.name,
          value: group.id
        }))
      })),
      company: eventTemplate.company && {
        label: eventTemplate.company.name,
        value: eventTemplate.company.id
      },
      responsibleGroup: eventTemplate.responsibleGroup && {
        label: eventTemplate.responsibleGroup.name,
        value: eventTemplate.responsibleGroup.id
      }
    },
    actionGrant,
    ...selectedValues
  };
};

const mapDispatchToProps = {
  handleSubmitCallback: event => createEvent(transformEvent(event)),
  fetchEvent,
  uploadFile
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(
    (props, dispatch) =>
      props.match.params.id && dispatch(fetchEvent(props.match.params.id))
  ),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  loadingIndicator(['initialValues'])
)(EventEditor);
