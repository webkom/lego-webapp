import React from 'react';
import LoadingIndicator from 'app/components/LoadingIndicator/';
import Image from 'app/components/Image';
import styles from './JoblistingDetail.css';
import { FlexRow, FlexColumn } from 'app/components/FlexBox';
import Markdown from 'app/components/Markdown';
import { Jobtype, Year, Workplaces } from './Items';
import Time from 'app/components/Time';

const JoblistingDetail = ({ joblisting }) => {
  let contactTitle = '';
  if (!joblisting) {
    return <LoadingIndicator loading />;
  }
  if (joblisting.responsible) {
    contactTitle = (
      <div>
        <li>
          <h3>Kontaktinfo:</h3>
        </li>
        <li>
          Navn: {joblisting.responsible.name || 'Ikke oppgitt.'}
        </li>
        <li>
          Mail: {joblisting.responsible.mail || 'Ikke oppgitt.'}
        </li>
        <li>
          Telefon: {joblisting.responsible.phone || 'Ikke oppgitt.'}
        </li>
      </div>
    );
  }
  return (
    <div className={styles.root}>
      <div className={styles.coverImage}>
        <Image src="http://placehold.it/1000x300" />
      </div>
      <h1>
        {joblisting.title}
      </h1>
      <FlexRow>
        <FlexColumn className={styles.description}>
          <Markdown>
            {joblisting.description || ''}
          </Markdown>
          <Markdown>
            {joblisting.text || ''}
          </Markdown>
        </FlexColumn>
        <FlexColumn className={styles.meta}>
          <ul>
            <li>
              <h3>Generell info:</h3>
            </li>
            <li>
              Søknadsfrist:{' '}
              <strong>
                <Time time={joblisting.deadline} format="ll HH:mm" />
              </strong>
            </li>
            <li>
              Søk her:{' '}
              <a
                href={`${joblisting.applicationUrl}`}
                className={styles.applicationUrl}
              >
                {joblisting.applicationUrl}
              </a>
            </li>
            <br />
            <li>
              {Jobtype(joblisting.jobType)}
            </li>
            <Year {...joblisting} />
            <Workplaces places={joblisting.workplaces} />
            {contactTitle}
          </ul>
        </FlexColumn>
      </FlexRow>
    </div>
  );
};

export default JoblistingDetail;
