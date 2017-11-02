// @flow

import React from 'react';
import { Link } from 'react-router';
import LoadingIndicator from 'app/components/LoadingIndicator/';
import { Image } from 'app/components/Image';
import DisplayContent from 'app/components/DisplayContent';
import styles from './JoblistingDetail.css';
import InfoList from 'app/components/InfoList';
import { Flex } from 'app/components/Layout';
import {
  Content,
  ContentSection,
  ContentMain,
  ContentSidebar
} from 'app/components/Content';
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
    <Link to={`/companies/${joblisting.company.id}`}>
      {joblisting.company.name}
    </Link>
  );

  const deadline = (
    <strong>
      <Time time={joblisting.deadline} format="ll HH:mm" />
    </strong>
  );

  const applicationUrl = (
    <a href={`${joblisting.applicationUrl}`}>{joblisting.applicationUrl}</a>
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
      <ContentSection>
        <ContentMain>
          <DisplayContent content={joblisting.description} />
          <DisplayContent content={joblisting.text} />
        </ContentMain>
        <ContentSidebar>
          <h3>Generell info</h3>
          {joblisting.applicationUrl && (
            <Flex column className={styles.apply}>
              <strong>Søk her:</strong>
              {applicationUrl}
            </Flex>
          )}

          <InfoList
            items={[
              { key: 'Stilling', value: jobType(joblisting.jobType) },
              { key: 'Bedrift', value: companyLink },
              { key: 'Søknadsfist', value: deadline },
              { key: 'Klassetrinn', value: <Year joblisting={joblisting} /> },
              {
                key: 'Sted',
                value: <Workplaces places={joblisting.workplaces} />
              }
            ].filter(Boolean)}
          />
          {joblisting.responsible && (
            <div>
              <h3>Kontaktinfo</h3>
              <InfoList
                items={[
                  {
                    key: 'Navn',
                    value: joblisting.responsible.name || 'Ikke oppgitt.'
                  },
                  {
                    key: 'Epost',
                    value: joblisting.responsible.mail || 'Ikke oppgitt.'
                  },
                  {
                    key: 'Telefon',
                    value: joblisting.responsible.phone || 'Ikke oppgitt.'
                  }
                ]}
              />
            </div>
          )}
        </ContentSidebar>
      </ContentSection>
    </Content>
  );
};

export default JoblistingDetail;
