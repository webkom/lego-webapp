// @flow

import React from 'react';
import styles from './Company.css';
import moment from 'moment';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { EventItem } from 'app/routes/events/components/EventList';
import Image from 'app/components/Image';
import { getImage } from 'app/utils';
import InfoBubble from 'app/components/InfoBubble';
import { Link } from 'react-router';
import Button from 'app/components/Button';
import Icon from 'app/components/Icon';

type Props = {
  company: Object
};

function insertInfoBubbles(company) {
  const infos = [['phone', company.phone], ['home', company.website],
  ['twitter', company.twitter], ['facebook', company.facebook], ['github', company.github]];

  return (
    <div className={styles.infoBubbles}>
      {infos
        .map((info, i) => (
          <InfoBubble
            icon={info[0]}
            data={info[1]}
            style={{ order: i }}
            link={info[1] && info[1].includes('/') ? info[1] : undefined}
            bubbleClass={styles.bubble}
            iconClass={styles.icon}
            dataClass={styles.data}
          />
      ))}
    </div>
  );
}

const CompanyDetail = ({ company }: Props) => {
  if (!company) {
    return <LoadingIndicator loading />;
  }

  return (
    <div className={styles.root}>
      <div className={styles.picture} >
        <Image src={getImage(company.id, 1000, 300)} />
      </div>

      <div className={styles.titleFlex}>
        <h1 className={styles.title} style={{ order: 1 }}>{company.name}</h1>
        <Link to={'/companies'} className={styles.editLink} style={{ order: 2 }}>
          <Button >
            <Icon name='pencil' />
            Endre
          </Button>
        </Link>
      </div>

      {insertInfoBubbles(company)}

      <div className={styles.description}>
        <p>{company.description}</p>
      </div>

      <div>
        <h3 className={styles.headings}>Kommende arrangementer</h3>
        {company.events
          .filter((event) => (moment().isSameOrBefore(event.startTime)))
          .map((event) => (
            <EventItem
              key={event.id}
              event={event}
            />
        ))}
      </div>

      <div>
        <h3 className={styles.headings}>Jobbannonser</h3>
        <ul>
          <li>joblisting 1</li>
          <li>joblisting 2</li>
          <p>...</p>
        </ul>
      </div>

      <div>
        <h3 className={styles.headings}>Tidligere Events</h3>
        {company.events
          .filter((event) => (moment().isAfter(event.startTime)))
          .sort((a, b) => (moment(b.startTime) - moment(a.startTime)))
          .map((event) => (
            <EventItem
              className={styles.eventItem}
              key={event.id}
              event={event}
            />
        ))}
      </div>
    </div>
  );
};

export default CompanyDetail;
