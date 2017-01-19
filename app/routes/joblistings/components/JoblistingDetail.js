import React from 'react';
import { getImage } from 'app/utils';
import LoadingIndicator from 'app/components/LoadingIndicator/';
import Image from 'app/components/Image';
import styles from './JoblistingDetail.css';
import { FlexRow, FlexColumn } from 'app/components/FlexBox';
import Markdown from 'app/components/Markdown';
import { Jobtype, Year, Workplaces } from './Items';
import Time from 'app/components/Time';

const JoblistingDetail = ({ joblisting }) => {
  let kontaktOverskrift = '';
  if (!joblisting) {
    return <LoadingIndicator loading />;
  }
  if (joblisting.contactName || joblisting.contactPhone || joblisting.contactEmail) {
    kontaktOverskrift = (
      <li>
        <h3>Kontaktinfo:</h3>
      </li>
    );
  }
  return (
    <div className={styles.root}>
      <div className={styles.coverImage}>
        <Image src={getImage(joblisting.id, 1000, 300)} />
      </div>
      <h1>{joblisting.title}</h1>
      <FlexRow>
        <FlexColumn className={styles.description}>
          <Markdown>{joblisting.description || ''}</Markdown>
          <Markdown>{joblisting.text || ''}</Markdown>
        </FlexColumn>
        <FlexColumn className={styles.meta}>
          <ul>
            <li>
              <h3>Generell info:</h3>
            </li>
            <li>
              Søknadsfrist:
              {' '}
              <strong>
                <Time
                  time={joblisting.deadline}
                  format='ll HH:mm'
                />
              </strong>
            </li>
            <br />
            <li>{Jobtype(joblisting.jobType)}</li>
            <Year {...joblisting} />
            <Workplaces places={joblisting.workplaces} />
            {kontaktOverskrift}
            <li>{joblisting.contactName}</li>
            <li>{joblisting.contactEmail}</li>
            <li>{joblisting.applicationUrl}</li>
          </ul>
        </FlexColumn>
      </FlexRow>
    </div>
  );
};

export default JoblistingDetail;
