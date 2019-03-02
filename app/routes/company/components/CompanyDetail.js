// @flow

import React from 'react';
import styles from './Company.css';
import { Content } from 'app/components/Content';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { Image } from 'app/components/Image';
import InfoBubble from 'app/components/InfoBubble';
import { Link } from 'react-router';
import truncateString from 'app/utils/truncateString';
import { eventTypes } from 'app/routes/events/utils';
import Time from 'app/components/Time';
import NavigationTab from 'app/components/NavigationTab';
import NavigationLink from 'app/components/NavigationTab/NavigationLink';
import { jobType, Year } from 'app/routes/joblistings/components/Items';
import Icon from 'app/components/Icon';

type Props = {
  company: Object,
  companyEvents: Array<Object>,
  joblistings: Array<Object>,
  showFetchMoreEvents: boolean,
  fetchMoreEvents: () => Promise<*>
};

function insertInfoBubbles(company) {
  const infos = [
    ['call', company.phone, 'Telefon'],
    ['at', company.website, 'Nettside'],
    ['home', company.address, 'Addresse'],
    ['briefcase', company.companyType, 'Type bedrift']
  ];

  return (
    <div className={styles.infoBubbles}>
      {infos.map((info, i) => (
        <InfoBubble
          key={info[0]}
          icon={info[0]}
          data={info[1]}
          meta={info[2]}
          style={{ order: i }}
          link={info[1] && info[1].includes('.') ? info[1] : undefined}
          small
          iconClass={styles.icon}
          dataClass={styles.data}
        />
      ))}
    </div>
  );
}

const CompanyDetail = (props: Props) => {
  const {
    company,
    companyEvents,
    joblistings,
    fetchMoreEvents,
    showFetchMoreEvents
  } = props;
  if (!company) {
    return <LoadingIndicator loading />;
  }

  const events =
    companyEvents &&
    companyEvents
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
      .map((event, i) => (
        <tr key={i}>
          <td>
            <Link to={`/events/${event.id}`}>{event.title}</Link>
          </td>
          <td>{eventTypes[event.eventType]}</td>
          <td>
            <Time time={event.startTime} format="DD.MM.YYYY" />
          </td>
          <td>{truncateString(event.location, 50)}</td>
          <td>{truncateString(event.description, 70)}</td>
          <td />
        </tr>
      ));
  const joblistingsList =
    joblistings &&
    joblistings.map(joblisting => (
      <tr key={joblisting.id}>
        <td>
          <Link to={`/joblistings/${joblisting.id}`}>{joblisting.title}</Link>
        </td>
        <td>{jobType(joblisting.jobType)}</td>
        <td>
          <Year joblisting={joblisting} />
        </td>
        <td>
          {joblisting.applicationUrl && (
            <a href={joblisting.applicationUrl}>
              <strong>SØK HER</strong>
            </a>
          )}
        </td>
      </tr>
    ));
  return (
    <Content>
      {company.logo && (
        <div className={styles.companyLogoDetail}>
          <Image src={company.logo} className={styles.image} />
        </div>
      )}

      <NavigationTab title={company.name}>
        <NavigationLink to="/companies">Tilbake til liste</NavigationLink>
      </NavigationTab>

      <div className={styles.description}>
        <p>{company.description}</p>
      </div>

      {insertInfoBubbles(company)}

      <h3 style={{ marginTop: '20px' }}>Bedriftens arrangementer</h3>
      {events.length > 0 ? (
        <table className={styles.companyEventTable}>
          <thead className={styles.categoryHeader}>
            <tr>
              <th>Tittel</th>
              <th>Arrangementstype</th>
              <th>Når</th>
              <th>Hvor</th>
              <th>Hva</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>{events}</tbody>
        </table>
      ) : (
        <i>Ingen arrangementer.</i>
      )}
      {showFetchMoreEvents && (
        <div
          style={{
            display: 'flex',
            width: '100%',
            marginTop: '10px',
            justifyContent: 'center'
          }}
        >
          <Icon
            name="arrow-dropdown"
            size={35}
            onClick={fetchMoreEvents}
            style={{ cursor: 'pointer' }}
          />
        </div>
      )}
      <h3 style={{ marginTop: '20px' }}>Bedriftens jobbannonser</h3>
      {joblistingsList.length > 0 ? (
        <table className={styles.companyEventTable}>
          <thead className={styles.categoryHeader}>
            <tr>
              <th>Tittel</th>
              <th>Jobbtype</th>
              <th>Klassetrinn</th>
              <th>Søknadslenke</th>
            </tr>
          </thead>
          <tbody>{joblistingsList}</tbody>
        </table>
      ) : (
        <i>Ingen jobbannonser.</i>
      )}
    </Content>
  );
};

export default CompanyDetail;
