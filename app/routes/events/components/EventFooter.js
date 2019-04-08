//@flow
import React from 'react';
import { Link } from 'react-router-dom';
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

const icalTypes = [
  { name: 'events', title: 'Alle arrangementer' },
  { name: 'registrations', title: 'Registreringstidspunkt' },
  { name: 'personal', title: 'Mine møter og favorittarrangementer' }
];

const getIcalUrl = (icalToken, icalType) =>
  `${config.serverUrl}/calendar-ical/${icalType}/?token=${icalToken}`;
const getIcalUrlGoogle = (icalToken, icalType) => {
  const icalUrl = getIcalUrl(icalToken, icalType).replace(/^https/i, 'http');
  return `https://www.google.com/calendar/render?cid=${icalUrl}`;
};
type Props = {
  icalToken: string
};

const EventFooter = ({ icalToken }: Props) => (
  <div className={styles.eventFooter}>
    {icalToken && (
      <p className={cx(styles.section, hiddenOnMobile)}>
        Her kan du importere arrangementer og møter til din favorittkalender!
        For innstillinger se
        <Link to="/users/me/settings"> her</Link>.
      </p>
    )}
    <div className={styles.eventFooterSections}>
      {icalToken && (
        <div className={cx(styles.section, hiddenOnMobile)}>
          <h3>Google kalender</h3>
          <ul>
            {icalTypes.map((type, key) => (
              <li key={key}>
                <a href={getIcalUrlGoogle(icalToken, type.name)}>
                  {type.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {icalToken && (
        <div className={cx(styles.section, hiddenOnMobile)}>
          <h3>iCalendar</h3>
          <ul>
            {icalTypes.map((type, key) => (
              <li key={key}>
                <a href={getIcalUrl(icalToken, type.name)}>{type.title}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
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
  </div>
);

export default EventFooter;
