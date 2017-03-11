import React from 'react';
import { Link } from 'react-router';
import styles from './EventFooter.css';
import { hiddenOnMobile } from 'app/styles/utilities.css';
import cx from 'classnames';

import colorForEvent from '../colorForEvent';

import Circle from 'app/components/Circle';
import config from 'app/config';

const eventTypes = [
  { eventType: 'company_presentation', name: 'Bedpress' },
  { eventType: 'lunch_presentation', name: 'Lunsjpresentasjon' },
  { eventType: 'course', name: 'Kurs' },
  { eventType: 'party', name: 'Fest' },
  { eventType: 'social', name: 'Sosialt' },
  { eventType: 'event', name: 'Arrangement' },
  { eventType: 'other', name: 'Annet' }
];

const getIcalUrl = (icalToken, icalType) =>
  `${config.serverUrl}/calendar/ical/${icalType}/?token=${icalToken}`;
const getIcalUrlGoogle = (icalToken, icalType) =>
  `https://www.google.com/calendar/render?cid=${getIcalUrl(icalToken, icalType)}`;

type Props = {
  icalToken: string
};

const EventFooter = ({ icalToken }: Props) => (
  <div className={styles.eventFooter}>
    {icalToken &&
      <div className={cx(styles.section, hiddenOnMobile)}>
        <h3>Google kalender</h3>
        <ul>
          <li>
            <Link to={getIcalUrlGoogle(icalToken, 'events')}>
              Alle arrangementer
            </Link>
          </li>
          <li>
            <Link to={getIcalUrlGoogle(icalToken, 'registration')}>
              Registreringstidspunkt
            </Link>
          </li>
          <li>
            <Link to={getIcalUrlGoogle(icalToken, 'personal')}>
              Mine møter og arrangementer
            </Link>
          </li>
        </ul>
      </div>}
    {icalToken &&
      <div className={cx(styles.section, hiddenOnMobile)}>
        <h3>ICalendar</h3>
        <ul>
          <li>
            <Link to={getIcalUrl(icalToken, 'events')}>Alle arrangementer</Link>
          </li>
          <li>
            <Link to={getIcalUrl(icalToken, 'registration')}>
              Registreringstidspunkt
            </Link>
          </li>
          <li>
            <Link to={getIcalUrl(icalToken, 'personal')}>
              Mine møter og arrangementer
            </Link>
          </li>
        </ul>
      </div>}
    <div className={styles.section}>
      <h3>Fargekoder</h3>
      <ul>
        {eventTypes.map(({ eventType, name }, id) => (
          <li key={id}>
            <Circle color={colorForEvent(eventType)} />
            <span className={styles.eventType}>{name}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default EventFooter;
