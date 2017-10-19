// @flow

import React from 'react';
import { Link } from 'react-router';
import LoadingIndicator from 'app/components/LoadingIndicator/';
import { Image } from 'app/components/Image';
import styles from './JoblistingDetail.css';
import { Flex, Content } from 'app/components/Layout';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import { jobType, Year, Workplaces } from './Items';
import Time from 'app/components/Time';
import Editor from 'app/components/Editor';
import Button from 'app/components/Button';

type ButtonsProps = {
  id: number,
  deleteJoblisting: number => void
};

const Buttons = ({ id, deleteJoblisting }) => (
  <Flex alignItems="center" className={styles.buttonRow}>
    <Link to={`/joblistings/${id}/edit`}>
      <Button> Rediger </Button>
    </Link>
    <Button dark onClick={() => deleteJoblisting(joblisting.id)}>
      Slett
    </Button>
  </Flex>
);

type Props = {
  joblisting: Object,
  deleteJoblisting: () => void,
  actionGrant: /*TODO: ActionGrant */ Array<any>,
  fetching: boolean
};

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
    <Content>
      <div className={styles.coverImage}>
        <Image src="http://placehold.it/1000x300" />
      </div>
      <NavigationTab
        title={joblisting.title}
        headerClassName={styles.headerDetail}
      >
        {actionGrant.includes('edit') && (
          <NavigationLink to={`/joblistings/${joblisting.id}/edit`}>
            Rediger
          </NavigationLink>
        )}
      </NavigationTab>
      <Flex className={styles.textbody}>
        <Flex column className={styles.description}>
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
        </Flex>
        <Flex column className={styles.meta}>
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
        </Flex>
      </Flex>
    </Content>
  );
};

export default JoblistingDetail;
