import { Button, Flex, Icon, LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchJoblisting } from 'app/actions/JoblistingActions';
import {
  Content,
  ContentSection,
  ContentMain,
  ContentSidebar,
  ContentHeader,
} from 'app/components/Content';
import DisplayContent from 'app/components/DisplayContent';
import InfoList from 'app/components/InfoList';
import { jobType, Year, Workplaces } from 'app/components/JoblistingItem/Items';
import PropertyHelmet from 'app/components/PropertyHelmet';
import Time from 'app/components/Time';
import config from 'app/config';
import { selectJoblistingByIdOrSlug } from 'app/reducers/joblistings';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import type { PropertyGenerator } from 'app/components/PropertyHelmet';
import type { DetailedJoblisting } from 'app/store/models/Joblisting';

const propertyGenerator: PropertyGenerator<{
  joblisting: DetailedJoblisting;
}> = ({ joblisting }, config) => {
  return [
    {
      property: 'og:title',
      content: joblisting.title,
    },
    {
      property: 'og:description',
      content: joblisting.description,
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:image:width',
      content: '1667',
    },
    {
      property: 'og:image:height',
      content: '500',
    },
    {
      property: 'og:url',
      content: `${config?.webUrl}/joblistings/${joblisting.id}`,
    },
    {
      property: 'og:image',
      content: joblisting.company.logo,
    },
  ];
};

const JoblistingDetail = () => {
  const { joblistingIdOrSlug } = useParams();
  const joblisting = useAppSelector((state) =>
    selectJoblistingByIdOrSlug(state, { joblistingIdOrSlug })
  ) as DetailedJoblisting;
  const fetching = useAppSelector((state) => state.joblistings.fetching);
  const actionGrant = joblisting?.actionGrant || [];

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchJoblisting',
    () => joblistingIdOrSlug && dispatch(fetchJoblisting(joblistingIdOrSlug)),
    [joblistingIdOrSlug]
  );

  const navigate = useNavigate();
  useEffect(() => {
    if (joblisting?.slug && joblisting?.slug !== joblistingIdOrSlug) {
      navigate(`/joblistings/${joblisting.slug}`, { replace: true });
    }
  }, [joblisting?.slug, navigate, joblistingIdOrSlug]);

  if (!joblisting) {
    return <LoadingIndicator loading={fetching} />;
  }

  const canEdit = actionGrant.includes('edit');
  const canDelete = actionGrant.includes('delete');

  return (
    <Content
      banner={joblisting.company.logo}
      youtubeUrl={joblisting.youtubeUrl}
    >
      <PropertyHelmet
        propertyGenerator={propertyGenerator}
        options={{ joblisting }}
      >
        <title>{joblisting.title}</title>
        <link
          rel="canonical"
          href={`${config?.webUrl}/joblistings/${joblisting.id}`}
        />
      </PropertyHelmet>
      <ContentHeader>
        <h2>{joblisting.title}</h2>
      </ContentHeader>
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
                value: (
                  <Link to={`/companies/${joblisting.company.id}`}>
                    {joblisting.company.name}
                  </Link>
                ),
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
                value: (
                  <strong>
                    <Time time={joblisting.deadline} format="ll HH:mm" />
                  </strong>
                ),
              },
              {
                key: 'Publisert',
                value: (
                  <strong>
                    <Time time={joblisting.createdAt} format="ll HH:mm" />
                  </strong>
                ),
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
