import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Button from 'app/components/Button';
import {
  Content,
  ContentSection,
  ContentMain,
  ContentSidebar,
  ContentHeader,
} from 'app/components/Content';
import DisplayContent from 'app/components/DisplayContent';
import Icon from 'app/components/Icon';
import InfoList from 'app/components/InfoList';
import { jobType, Year, Workplaces } from 'app/components/JoblistingItem/Items';
import Flex from 'app/components/Layout/Flex';
import LoadingIndicator from 'app/components/LoadingIndicator/';
import Time from 'app/components/Time';
import type { ActionGrant } from 'app/models';
import type { DetailedJoblisting } from 'app/store/models/Joblisting';

type Props = {
  joblisting: DetailedJoblisting;
  actionGrant: ActionGrant;
  fetching: boolean;
};

const JoblistingDetail = ({
  joblisting,
  actionGrant,
  fetching = false,
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
  const createdAt = (
    <strong>
      <Time time={joblisting.createdAt} format="ll HH:mm" />
    </strong>
  );
  const canEdit = actionGrant.includes('edit');
  const canDelete = actionGrant.includes('delete');
  return (
    <Content
      banner={joblisting.company.logo}
      youtubeUrl={joblisting.youtubeUrl}
    >
      <Helmet title={joblisting.title} />
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
              {
                key: 'Type',
                value: jobType(joblisting.jobType),
              },
              {
                key: 'Bedrift',
                value: companyLink,
              },
              {
                key: 'Klassetrinn',
                value: <Year joblisting={joblisting} />,
              },
              joblisting.workplaces.length && {
                key: 'Sted',
                value: <Workplaces places={joblisting.workplaces} />,
              },
              {
                key: 'Søknadsfrist',
                value: deadline,
              },
              {
                key: 'Publisert',
                value: createdAt,
              },
            ].filter(Boolean)}
          />
          {joblisting.applicationUrl && (
            <a
              href={joblisting.applicationUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Button success>Søk her</Button>
            </a>
          )}
          {(joblisting.responsible || joblisting.contactMail) && (
            <div
              style={{
                marginTop: '10px',
              }}
            >
              <h3>Kontaktinfo</h3>
              {joblisting.contactMail && (
                <div>
                  <InfoList
                    items={[
                      {
                        key: 'E-post',
                        value: joblisting.contactMail,
                      },
                    ]}
                  />
                  {joblisting.responsible && (
                    <div
                      style={{
                        marginTop: '10px',
                      }}
                    >
                      <strong>Kontaktperson</strong>
                    </div>
                  )}
                </div>
              )}
              {joblisting.responsible && (
                <div
                  style={{
                    marginTop: '0px',
                  }}
                >
                  <InfoList
                    items={[
                      {
                        key: 'Navn',
                        value: joblisting.responsible.name || 'Ikke oppgitt.',
                      },
                      {
                        key: 'E-post',
                        value: joblisting.responsible.mail || 'Ikke oppgitt.',
                      },
                      {
                        key: 'Telefon',
                        value: joblisting.responsible.phone || 'Ikke oppgitt.',
                      },
                    ]}
                  />
                </div>
              )}
            </div>
          )}

          {(canEdit || canDelete) && (
            <Flex
              column
              style={{
                marginTop: '10px',
              }}
            >
              <h3>Admin</h3>
              {canEdit && (
                <Link to={`/joblistings/${joblisting.id}/edit`}>
                  <Button>
                    <Icon name="create-outline" size={19} />
                    Rediger
                  </Button>
                </Link>
              )}
            </Flex>
          )}
        </ContentSidebar>
      </ContentSection>
    </Content>
  );
};

export default JoblistingDetail;
