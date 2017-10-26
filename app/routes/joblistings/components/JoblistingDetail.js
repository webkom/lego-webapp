// @flow

import React from 'react';
import { Link } from 'react-router';
import LoadingIndicator from 'app/components/LoadingIndicator/';
import { Image } from 'app/components/Image';
import DisplayContent from 'app/components/DisplayContent';
import styles from './JoblistingDetail.css';
import { Flex, Content } from 'app/components/Layout';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import { jobType, Year, Workplaces } from './Items';
import Time from 'app/components/Time';

type Props = {
  joblisting: Object,
  actionGrant: /*TODO: ActionGrant */ Array<any>,
  fetching: boolean
};

const JoblistingDetail = ({
  joblisting,
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
      {joblisting.company.logo && (
        <div className={styles.coverImage}>
          <Image src={joblisting.company.logo} />
        </div>
      )}
      <NavigationTab
        title={joblisting.title}
        headerClassName={styles.headerDetail}
      >
        {actionGrant.includes('edit') && (
          <div>
            <NavigationLink to={`/joblistings/${joblisting.id}/edit`}>
              Rediger
            </NavigationLink>
          </div>
        )}
      </NavigationTab>
      <Flex className={styles.textbody}>
        <Flex column className={styles.description}>
          <DisplayContent content={joblisting.description} />
          <DisplayContent content={joblisting.text} />
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
