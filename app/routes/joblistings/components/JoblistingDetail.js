// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import LoadingIndicator from 'app/components/LoadingIndicator/';
import DisplayContent from 'app/components/DisplayContent';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';
import styles from './JoblistingDetail.css';
import InfoList from 'app/components/InfoList';
import {
  Content,
  ContentSection,
  ContentMain,
  ContentSidebar,
  ContentHeader
} from 'app/components/Content';
import { jobType, Year, Workplaces } from './Items';
import Time from 'app/components/Time';
import type { ID } from 'app/models';

type Props = {
  joblisting: Object,
  actionGrant: /*TODO: ActionGrant */ Array<any>,
  deleteJoblisting: ID => Promise<*>,
  fetching: boolean,
  push: string => void
};

const JoblistingDetail = ({
  joblisting,
  actionGrant,
  deleteJoblisting,
  push,
  fetching = false
}: Props) => {
  if (fetching || !joblisting) {
    return <LoadingIndicator loading />;
  }

  const onDeleteJoblisting = () =>
    deleteJoblisting(joblisting.id).then(() => {
      push('/joblistings/');
    });

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

  const canEdit = actionGrant.includes('edit');
  const canDelete = actionGrant.includes('delete');

  return (
    <Content
      banner={joblisting.company.logo}
      youtubeUrl={joblisting.youtubeUrl}
    >
      <ContentHeader>{joblisting.title}</ContentHeader>
      <ContentSection>
        <ContentMain>
          <DisplayContent content={joblisting.description} />
          <DisplayContent content={joblisting.text} />
        </ContentMain>
        <ContentSidebar>
          <h3>Generell info</h3>
          <InfoList
            items={[
              { key: 'Type', value: jobType(joblisting.jobType) },
              { key: 'Bedrift', value: companyLink },
              { key: 'Klassetrinn', value: <Year joblisting={joblisting} /> },
              {
                key: 'Sted',
                value: <Workplaces places={joblisting.workplaces} />
              },
              { key: 'Søknadsfrist', value: deadline }
            ]}
          />
          {joblisting.applicationUrl && (
            <a href={joblisting.applicationUrl} style={{ marginTop: '10px' }}>
              <strong>SØK HER</strong>
            </a>
          )}
          {(joblisting.responsible || joblisting.contactMail) && (
            <div style={{ marginTop: '10px' }}>
              <h3>Kontaktinfo</h3>
              {joblisting.contactMail && (
                <div>
                  <InfoList
                    items={[
                      {
                        key: 'Epost',
                        value: joblisting.contactMail
                      }
                    ]}
                  />
                  {joblisting.responsible && (
                    <div style={{ marginTop: '10px' }}>
                      <strong>Kontaktperson:</strong>
                    </div>
                  )}
                </div>
              )}
              {joblisting.responsible && (
                <div style={{ marginTop: '0px' }}>
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
            </div>
          )}

          {(canEdit || canDelete) && (
            <ul style={{ marginTop: '10px' }}>
              <li>
                <strong>Admin</strong>
              </li>
              {canEdit && (
                <li>
                  <Link to={`/joblistings/${joblisting.id}/edit`}>Rediger</Link>
                </li>
              )}
              {canDelete && (
                <li>
                  <ConfirmModalWithParent
                    title="Slett jobbannonse"
                    message="Er du sikker på at du vil slette denne jobbannonsen?"
                    onConfirm={onDeleteJoblisting}
                  >
                    <span className={styles.deleteButton}>Slett</span>
                  </ConfirmModalWithParent>
                </li>
              )}
            </ul>
          )}
        </ContentSidebar>
      </ContentSection>
    </Content>
  );
};

export default JoblistingDetail;
