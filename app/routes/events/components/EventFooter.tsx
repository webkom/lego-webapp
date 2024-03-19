import { Link } from 'react-router-dom';
import p96 from 'app/assets/sommerfest/8f30334f32984124.png';
import Circle from 'app/components/Circle';
import Sommerfest from 'app/components/Sommerfest/Sommerfest';
import config from 'app/config';
import { EventTypeConfig } from '../utils';
import styles from './EventFooter.css';
import type { IcalToken } from 'app/models';

const icalTypes: { name: IcalType; title: string }[] = [
  {
    name: 'events',
    title: 'Alle arrangementer',
  },
  {
    name: 'registrations',
    title: 'Registreringstidspunkt',
  },
  {
    name: 'personal',
    title: 'Dine møter og favorittarrangementer',
  },
];

type IcalType = 'events' | 'registrations' | 'personal';

export const getIcalUrl = (icalToken: IcalToken, icalType: IcalType) =>
  `${config.serverUrl}/calendar-ical/${icalType}/?token=${icalToken}`;

export const getIcalUrlGoogle = (icalToken: IcalToken, icalType: IcalType) => {
  const icalUrl = getIcalUrl(icalToken, icalType).replace(/^https/i, 'http');
  return `https://www.google.com/calendar/render?cid=${icalUrl}`;
};

type Props = {
  icalToken: string;
};

const EventFooter = ({ icalToken }: Props) => (
  <>
    {' '}
    <Sommerfest src={p96} className={styles.sommerfest} />
    <div className={styles.eventFooter}>
      {icalToken && (
        <p className={styles.section}>
          Her kan du importere arrangementer og møter til din favorittkalender!
          For innstillinger se
          <Link to="/users/me/settings"> her</Link>.
        </p>
      )}
      <div className={styles.eventFooterSections}>
        {icalToken && (
          <div className={styles.section}>
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
          <div className={styles.section}>
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
            {Object.entries(EventTypeConfig).map(([key, config]) => (
              <li key={key}>
                <Circle color={config.color} />
                <span className={styles.eventType}>{config.displayName}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </>
);

export default EventFooter;
