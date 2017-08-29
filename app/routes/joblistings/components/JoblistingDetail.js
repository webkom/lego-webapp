// @flow

import React from 'react';
import { Link } from 'react-router';
import LoadingIndicator from 'app/components/LoadingIndicator/';
import Image from 'app/components/Image';
import styles from './JoblistingDetail.css';
import { FlexRow, FlexColumn } from 'app/components/FlexBox';
import { jobType, Year, Workplaces } from './Items';
import Time from 'app/components/Time';
import Editor from 'app/components/Editor';

type Props = {
  joblisting: Object,
  deleteJoblisting: () => void,
  actionGrant: Array
};

const Buttons = ({ id, deleteJoblisting }) =>
  <FlexColumn>
    <FlexRow>
      <Link to={`/joblistings/${id}/edit`}>
        <button className={styles.editButton}> Rediger </button>
      </Link>
      <Link onClick={() => deleteJoblisting(id)}>
        <button className={styles.editButton}> Slett </button>
      </Link>
    </FlexRow>
  </FlexColumn>;

const JoblistingDetail = ({
  joblisting,
  deleteJoblisting,
  actionGrant
}: Props) => {
  if (!joblisting) {
    return <LoadingIndicator loading />;
  }

  return (
    <div className={styles.root}>
      <div className={styles.coverImage}>
        <Image src="http://placehold.it/1000x300" />
      </div>
      <FlexRow className={styles.title}>
        {actionGrant.includes('update') &&
          <Buttons id={joblisting.id} deleteJoblisting={deleteJoblisting} />}
        <FlexColumn>
          <h1>
            {joblisting.title}
          </h1>
        </FlexColumn>
      </FlexRow>
      <FlexRow className={styles.textbody}>
        <FlexColumn className={styles.meta}>
          <ul>
            <li>
              <h3>Generell info:</h3>
            </li>
            <li>
              Bedrift:{' '}
              <Link
                to={`/companies/${joblisting.company.id}`}
                className={styles.company}
              >
                {joblisting.company.name}
              </Link>
            </li>
            <li>
              Søknadsfrist:{' '}
              <strong>
                <Time time={joblisting.deadline} format="ll HH:mm" />
              </strong>
            </li>
            {joblisting.applicationUrl &&
              <li>
                Søk her:{' '}
                <a
                  href={`${joblisting.applicationUrl}`}
                  className={styles.applicationUrl}
                >
                  {joblisting.applicationUrl}
                </a>
              </li>}
            <br />
            <li>
              {jobType(joblisting.jobType)}
            </li>
            <Year joblisting={joblisting} />
            <Workplaces places={joblisting.workplaces} />
            {joblisting.responsible &&
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
              </div>}
          </ul>
        </FlexColumn>
        <FlexColumn className={styles.description}>
          <Editor
            readOnly
            value={`<div>
                ${joblisting.description}
              </div>`}
          />
          <Editor
            readOnly
            value={`<div>
                ${joblisting.text}
              </div>`}
          />
        </FlexColumn>
      </FlexRow>
    </div>
  );
};

export default JoblistingDetail;
