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
import { transformEvent, time } from './utils';
import prepare from 'app/utils/prepare';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { isEmpty } from 'lodash';
import { fetchEvent } from 'app/actions/EventActions';
import loadingIndicator from 'app/utils/loadingIndicator';

const mapStateToProps = (state, props) => {
  const actionGrant = state.events.actionGrant;
  const valueSelector = formValueSelector('eventEditor');
  const eventId = props.location.query.id;

  const eventTemplate = selectEventById(state, { eventId });
  const poolsTemplate = selectPoolsWithRegistrationsForEvent(state, {
    eventId
  });

  const initialValues = {
    title: '',
    startTime: time({ hours: 17, minutes: 15 }),
    endTime: time({ hours: 20, minutes: 15 }),
    description: '',
    text: '',
    eventType: '',
    company: null,
    responsibleGroup: null,
    location: 'TBA',
    isPriced: false,
    useStripe: true,
    priceMember: 0,
    paymentDueDate: time({ days: 7, hours: 17, minutes: 15 }),
    mergeTime: time({ hours: 12 }),
    useCaptcha: true,
    heedPenalties: true,
    isAbakomOnly: false,
    feedbackDescription: 'Melding til arrangører',
    pools: [],
    unregistrationDeadline: time({ hours: 12 })
  };

  if (isEmpty(eventTemplate) && eventId) {
    return { initialValues: null };
  }

  return {
    initialValues: isEmpty(eventTemplate)
      ? initialValues
      : {
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
    event: {
      addFee: valueSelector(state, 'addFee'),
      isPriced: valueSelector(state, 'isPriced'),
      eventType: valueSelector(state, 'eventType'),
      priceMember: valueSelector(state, 'priceMember'),
      startTime: valueSelector(state, 'startTime')
    },
    pools: valueSelector(state, 'pools')
  };
};

const mapDispatchToProps = {
  handleSubmitCallback: event => createEvent(transformEvent(event)),
  uploadFile
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(({ location }, dispatch) => dispatch(fetchEvent(location.query.id))),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  loadingIndicator(['initialValues'])
)(EventEditor);
