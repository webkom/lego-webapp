import { Flex, Icon, LinkButton, LoadingPage, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Pencil } from 'lucide-react';
import { useEffect } from 'react';
import { navigate } from 'vike/client/router';
import YoutubeCover from 'app/routes/pages/components/YoutubeCover';
import {
  ContentSection,
  ContentMain,
  ContentSidebar,
} from '~/components/Content';
import DisplayContent from '~/components/DisplayContent';
import InfoList from '~/components/InfoList';
import { jobType, Year, Workplaces } from '~/components/JoblistingItem/Items';
import PropertyHelmet from '~/components/PropertyHelmet';
import Time from '~/components/Time';
import { fetchJoblisting } from '~/redux/actions/JoblistingActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectJoblistingByIdOrSlug } from '~/redux/slices/joblistings';
import { isTruthy } from '~/utils';
import { appConfig } from '~/utils/appConfig';
import { useParams } from '~/utils/useParams';
import type { PropertyGenerator } from '~/components/PropertyHelmet';
import type { DetailedJoblisting } from '~/redux/models/Joblisting';

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

const MailWrapper = ({ mail }: { mail: string }) => (
  <a href={`mailto:${mail}`}>
    {mail.split('@')[0]}
    <wbr />@{mail.split('@')[1]}
  </a>
);

const NotGiven = () => <span className="secondaryFontColor">Ikke oppgitt</span>;

const JoblistingDetail = () => {
  const { joblistingIdOrSlug } = useParams();
  const joblisting = useAppSelector((state) =>
    selectJoblistingByIdOrSlug<DetailedJoblisting>(state, joblistingIdOrSlug),
  );
  const fetching = useAppSelector((state) => state.joblistings.fetching);
  const actionGrant = joblisting?.actionGrant || [];

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchJoblisting',
    () => joblistingIdOrSlug && dispatch(fetchJoblisting(joblistingIdOrSlug)),
    [joblistingIdOrSlug],
  );

  useEffect(() => {
    if (joblisting?.slug && joblisting?.slug !== joblistingIdOrSlug) {
      navigate(`/joblistings/${joblisting.slug}`, {
        overwriteLastHistoryEntry: true,
      });
    }
  }, [joblisting?.slug, joblistingIdOrSlug]);

  if (!joblisting) {
    return <LoadingPage cover loading={fetching} />;
  }

  const canEdit = actionGrant.includes('edit');
  const canDelete = actionGrant.includes('delete');

  const showContactMail =
    joblisting.contactMail &&
    joblisting.contactMail !== joblisting.responsible?.mail;

  return (
    <Page
      cover={
        <YoutubeCover
          image={joblisting.company.logo}
          youtubeUrl={joblisting.youtubeUrl}
        />
      }
      title={joblisting.title}
    >
      <PropertyHelmet
        propertyGenerator={propertyGenerator}
        options={{ joblisting }}
      >
        <title>{joblisting.title}</title>
        <link
          rel="canonical"
          href={`${appConfig?.webUrl}/joblistings/${joblisting.id}`}
        />
      </PropertyHelmet>
      <ContentSection>
        <ContentMain>
          <DisplayContent content={joblisting.description} />
          <DisplayContent content={joblisting.text} />
        </ContentMain>
        <ContentSidebar>
          <div>
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
                    <a href={`/companies/${joblisting.company.id}`}>
                      {joblisting.company.name}
                    </a>
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
                      {joblisting.rollingRecruitment ? (
                        'Snarest'
                      ) : (
                        <Time time={joblisting.deadline} format="ll HH:mm" />
                      )}
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
              ].filter(isTruthy)}
            />
          </div>

          {joblisting.applicationUrl && (
            <LinkButton
              success
              href={joblisting.applicationUrl}
              target="_blank"
              rel="noreferrer"
            >
              Søk her
            </LinkButton>
          )}

          {(joblisting.responsible || joblisting.contactMail) && (
            <div>
              <h3>Kontaktinfo</h3>
              <Flex column gap="var(--spacing-sm)">
                {showContactMail && (
                  <InfoList
                    items={[
                      {
                        key: 'E-post',
                        value: <MailWrapper mail={joblisting.contactMail} />,
                      },
                    ]}
                  />
                )}
                {joblisting.responsible && (
                  <div>
                    {showContactMail && <h4>Kontaktperson</h4>}
                    <InfoList
                      items={[
                        {
                          key: 'Navn',
                          value: joblisting.responsible.name || <NotGiven />,
                        },
                        {
                          key: 'E-post',
                          value: joblisting.responsible.mail ? (
                            <MailWrapper mail={joblisting.responsible.mail} />
                          ) : (
                            <NotGiven />
                          ),
                        },
                        {
                          key: 'Telefon',
                          value: joblisting.responsible.phone ? (
                            <a href={`tel:${joblisting.responsible.phone}`}>
                              {joblisting.responsible.phone}
                            </a>
                          ) : (
                            <NotGiven />
                          ),
                        },
                      ]}
                    />
                  </div>
                )}
              </Flex>
            </div>
          )}

          {(canEdit || canDelete) && (
            <div>
              <h3>Admin</h3>
              {canEdit && (
                <LinkButton href={`/joblistings/${joblisting.id}/edit`}>
                  <Icon iconNode={<Pencil />} size={19} />
                  Rediger
                </LinkButton>
              )}
            </div>
          )}
        </ContentSidebar>
      </ContentSection>
    </Page>
  );
};

export default JoblistingDetail;
