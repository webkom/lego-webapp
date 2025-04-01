import {
  Card,
  ConfirmModal,
  Flex,
  Icon,
  LinkButton,
  Tooltip,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { keys } from 'lodash-es';
import { Copy, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ContentMain } from '~/components/Content';
import EmptyState from '~/components/EmptyState';
import Table from '~/components/Table';
import Time from '~/components/Time';
import {
  deleteOAuth2Grant,
  fetchOAuth2Applications,
  fetchOAuth2Grants,
} from '~/redux/actions/OAuth2Actions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectAllOAuth2Applications } from '~/redux/slices/oauth2Applications';
import { selectAllOAuth2Grants } from '~/redux/slices/oauth2Grants';
import { appConfig } from '~/utils/appConfig';
import styles from './UserSettingsOAuth2.module.css';

const UserSettingsOAuth2 = () => {
  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchUserSettingsOAuth2',
    () =>
      Promise.allSettled([
        dispatch(fetchOAuth2Applications()),
        dispatch(fetchOAuth2Grants()),
      ]),
    [],
  );

  const applications = useAppSelector(selectAllOAuth2Applications);
  const grants = useAppSelector(selectAllOAuth2Grants);
  const actionGrant = useAppSelector(
    (state) => state.oauth2Applications.actionGrant,
  );
  const fetchingApplications = useAppSelector(
    (state) => state.oauth2Applications.fetching,
  );
  const fetchingGrants = useAppSelector((state) => state.oauth2Grants.fetching);

  const [copiedClientId, setCopiedClientId] = useState<string>('');
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleCopyButtonClick = (clientId: string) => {
    navigator.clipboard.writeText(clientId).then(() => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      setCopiedClientId(clientId);

      const newTimeoutId = setTimeout(() => {
        setCopiedClientId('');
      }, 2000);

      setTimeoutId(newTimeoutId);
    });
  };

  const applicationColumns = [
    {
      title: 'Navn',
      dataIndex: 'application.name',
      render: (id, application) => (
        <a href={`/users/me/settings/oauth2/${application.id}`}>
          {application.name}
        </a>
      ),
    },
    {
      title: 'Beskrivelse',
      dataIndex: 'application.description',
      render: (id, application) => application.description,
    },
    {
      title: 'Client ID',
      dataIndex: 'application.clientId',
      render: (id, application) => {
        const copied = copiedClientId === application.clientId;
        return (
          <Flex wrap alignItems="center" gap="var(--spacing-sm)">
            {application.clientId}
            <Tooltip content={copied ? 'Kopiert!' : 'Kopier client ID'}>
              <Icon
                iconNode={
                  <Copy
                    fill={copied ? 'var(--success-color)' : 'transparent'}
                  />
                }
                size={20}
                success={copied}
                className={styles.copyIcon}
                onPress={() => handleCopyButtonClick(application.clientId)}
              />
            </Tooltip>
          </Flex>
        );
      },
    },
  ];

  const acceptedApplicationcolumns = [
    {
      title: 'Applikasjon',
      dataIndex: 'grant.application.name',
      render: (id, grant) => grant.application.name,
    },
    {
      title: 'Utløper',
      dataIndex: 'grant.expires',
      render: (id, grant) => (
        <Time time={grant.expires} format="DD.MM.YYYY HH:mm" />
      ),
    },
    {
      title: 'Token',
      dataIndex: 'grant.token',
      render: (id, grant) => grant.token,
    },
    {
      title: 'Tilganger',
      dataIndex: 'grant.scopes',
      render: (id, grant) => keys(grant.scopes).join(', '),
    },
    {
      dataIndex: 'delete',
      render: (id, grant) => (
        <ConfirmModal
          title="Bekreft handling"
          message={`Er du sikker på at du vil fjerne token?`}
          onConfirm={() => dispatch(deleteOAuth2Grant(grant.id))}
          closeOnCancel
        >
          {({ openConfirmModal }) => (
            <Tooltip content="Fjern">
              <Flex justifyContent="center">
                <Icon
                  onPress={openConfirmModal}
                  iconNode={<Trash2 />}
                  size={19}
                  danger
                />
              </Flex>
            </Tooltip>
          )}
        </ConfirmModal>
      ),
    },
  ];

  return (
    <ContentMain>
      <span>
        Denne nettsiden benytter seg av et API som også er tiljengelig for andre
        applikasjoner. OAuth2 er samme metode som GitHub og andre benytter seg
        av for pålogging. Du kan lese mer i{' '}
        <a href={`${appConfig.baseUrl}/docs/authentication.html#oauth2`}>
          dokumentasjonen
        </a>{' '}
        til APIet. Kontakt{' '}
        <a href="mailto:webkom@abakus.no">webkom@abakus.no</a> hvis du ønsker å
        slette en applikasjon du har opprettet.
      </span>

      <Card severity="warning">
        <Card.Header>Obs!</Card.Header>
        <span>
          <i>Client ID</i> og <i>Client secret</i> ansees som hemmelig og må
          ikke inkluderes i kode som gjøres tiljengelig for sluttbrukere, typisk
          en webapp eller en mobilapplikasjon.
        </span>
      </Card>

      <ul>
        <li>
          Auth Url:{' '}
          <a href={`${appConfig.baseUrl}/authorization/oauth2/authorize/`}>
            {appConfig.baseUrl}
            /authorization/oauth2/authorize/
          </a>
        </li>
        <li>
          Access Token Url:{' '}
          <a href={`${appConfig.baseUrl}/authorization/oauth2/token/`}>
            {appConfig.baseUrl}
            /authorization/oauth2/token/
          </a>
        </li>
      </ul>

      <Flex column gap="var(--spacing-sm)">
        <Flex justifyContent="space-between" alignItems="center">
          <h3>Applikasjoner</h3>
          {actionGrant.includes('create') && (
            <LinkButton href="/users/me/settings/oauth2/new">
              Ny applikasjon
            </LinkButton>
          )}
        </Flex>
        {applications.length === 0 && !fetchingApplications ? (
          <EmptyState body="Du har ingen applikasjoner" />
        ) : (
          <Table
            columns={applicationColumns}
            data={applications}
            loading={fetchingApplications}
            hasMore={false}
          />
        )}
      </Flex>

      <Flex column gap="var(--spacing-sm)">
        <h3>Aksepterte applikasjoner</h3>
        {grants.length === 0 && !fetchingGrants ? (
          <EmptyState body="Du har ikke logget på en app enda" />
        ) : (
          <Table
            columns={acceptedApplicationcolumns}
            data={grants}
            loading={fetchingGrants}
            hasMore={false}
          />
        )}
      </Flex>
    </ContentMain>
  );
};

export default UserSettingsOAuth2;
