// @flow

import React from 'react';
import { Link } from 'react-router';
import LoadingIndicator from 'app/components/LoadingIndicator/';
import { Image } from 'app/components/Image';
import styles from './JoblistingDetail.css';
import { FlexRow, FlexColumn, FlexItem } from 'app/components/FlexBox';
import { jobType, Year, Workplaces } from './Items';
import Time from 'app/components/Time';
import Editor from 'app/components/Editor';

type Props = {
  joblisting: Object,
  deleteJoblisting: () => void,
  actionGrant: Array,
  fetching: boolean
};

const Buttons = ({ id, deleteJoblisting }) => (
  <FlexRow alignItems="center">
    <Link to={`/joblistings/${id}/edit`}>
      <button className={styles.editButton}> Rediger </button>
    </Link>
    <Link onClick={() => deleteJoblisting(id)}>
      <button className={styles.editButton}> Slett </button>
    </Link>
  </FlexRow>
);

const JoblistingDetail = ({
  joblisting,
  deleteJoblisting,
  actionGrant,
  fetching = false
}: Props) => {
  if (fetching || !joblisting) {
    return <LoadingIndicator loading />;
  }

  const companyLink = (
    <Link to={`/companies/${joblisting.company.id}`} className={styles.company}>
      {joblisting.company.name}
    </Link>
  );

  const deadline = (
    <strong>
      <Time time={joblisting.deadline} format="ll HH:mm" />
    </strong>
  );

  const applicationUrl = (
    <a href={`${joblisting.applicationUrl}`} className={styles.applicationUrl}>
      {joblisting.applicationUrl}
    </a>
  );

  return (
    <div className={styles.root}>
      <div className={styles.coverImage}>
        <Image src="http://placehold.it/1000x300" />
      </div>
      <FlexRow className={styles.title}>
        <FlexItem>
          <h1>{joblisting.title}</h1>
        </FlexItem>
        {actionGrant.includes('edit') && (
          <Buttons id={joblisting.id} deleteJoblisting={deleteJoblisting} />
        )}
      </FlexRow>
      <FlexRow className={styles.textbody}>
        <FlexColumn className={styles.meta}>
          <ul>
            <li>
              <h3>Generell info:</h3>
            </li>
            <li>Bedrift: {companyLink}</li>
            <li>Søknadsfrist: {deadline}</li>
            {joblisting.applicationUrl && <li>Søk her: {applicationUrl}</li>}
            <br />
            <li>{jobType(joblisting.jobType)}</li>
            <Year joblisting={joblisting} />
            <Workplaces places={joblisting.workplaces} />
            {joblisting.responsible && (
              <div>
                <li>
                  <h3>Kontaktinfo:</h3>
                </li>
                <li>Navn: {joblisting.responsible.name || 'Ikke oppgitt.'}</li>
                <li>Mail: {joblisting.responsible.mail || 'Ikke oppgitt.'}</li>
                <li>
                  Telefon: {joblisting.responsible.phone || 'Ikke oppgitt.'}
                </li>
              </div>
            )}
          </ul>
        </FlexColumn>
        <FlexColumn className={styles.description}>
          <Editor readOnly value={joblisting.description} />
          <Editor readOnly value={joblisting.text} />
        </FlexColumn>
      </FlexRow>
    </div>
  );
};

export default JoblistingDetail;
