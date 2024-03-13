import { Button, Card, ConfirmModal, Flex, Icon } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import keys from 'lodash/keys';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  deleteOAuth2Grant,
  fetchOAuth2Applications,
  fetchOAuth2Grants,
} from 'app/actions/OAuth2Actions';
import Table from 'app/components/Table';
import Time from 'app/components/Time';
import Tooltip from 'app/components/Tooltip';
import config from 'app/config';
import {
  selectOAuth2Applications,
  selectOAuth2Grants,
} from 'app/reducers/oauth2';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import styles from './UserSettingsOAuth2.css';

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

  const applications = useAppSelector(selectOAuth2Applications);
  const grants = useAppSelector(selectOAuth2Grants);
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
        <Link to={`/users/me/settings/oauth2/${application.id}`}>
          {application.name}
        </Link>
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
          <Flex wrap gap={10}>
            {application.clientId}
            <Tooltip content={copied ? 'Kopiert!' : 'Kopier client ID'}>
              <Icon
                name={copied ? 'copy' : 'copy-outline'}
                size={20}
                success={copied}
                className={styles.copyIcon}
                onClick={() => handleCopyButtonClick(application.clientId)}
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
                  onClick={openConfirmModal}
                  name="trash"
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
    <>
      <h2>OAuth2</h2>
      <p>
        Denne nettsiden benytter seg av et API som også er tiljengelig for andre
        applikasjoner. OAuth2 er samme metode som GitHub og andre benytter seg
        av for pålogging. Du kan lese mer i{' '}
        <a href={`${config.baseUrl}/docs/authentication.html#oauth2`}>
          dokumentasjonen
        </a>{' '}
        til APIet. Kontakt{' '}
        <a href="mailto:webkom@abakus.no">webkom@abakus.no</a> hvis du ønsker å
        slette en applikasjon du har opprettet.
      </p>

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
          <a href={`${config.baseUrl}/authorization/oauth2/authorize/`}>
            {config.baseUrl}
            /authorization/oauth2/authorize/
          </a>
        </li>
        <li>
          Access Token Url:{' '}
          <a href={`${config.baseUrl}/authorization/oauth2/token/`}>
            {config.baseUrl}
            /authorization/oauth2/token/
          </a>
        </li>
      </ul>

      <h3>Applikasjoner</h3>
      <Flex column gap="var(--spacing-md)">
        {actionGrant.includes('create') && (
          <Button>
            <Link to="/users/me/settings/oauth2/new">Ny applikasjon</Link>
          </Button>
        )}
        {applications.length === 0 && !fetchingApplications ? (
          <span className="secondaryFontColor">Du har ingen applikasjoner</span>
        ) : (
          <Table
            columns={applicationColumns}
            data={applications}
            loading={fetchingApplications}
            hasMore={false}
          />
        )}
      </Flex>

      <h3>Aksepterte applikasjoner</h3>
      {grants.length === 0 && !fetchingGrants ? (
        <span className="secondaryFontColor">
          Du har ikke logget på en app enda
        </span>
      ) : (
        <Table
          columns={acceptedApplicationcolumns}
          data={grants}
          loading={fetchingGrants}
          hasMore={false}
        />
      )}
    </>
  );
};

export default UserSettingsOAuth2;
