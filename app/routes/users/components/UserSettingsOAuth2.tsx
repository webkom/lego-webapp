import keys from 'lodash/keys';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'app/components/Button';
import Icon from 'app/components/Icon';
import Flex from 'app/components/Layout/Flex';
import { ConfirmModal } from 'app/components/Modal/ConfirmModal';
import Table from 'app/components/Table';
import Time from 'app/components/Time';
import Tooltip from 'app/components/Tooltip';
import config from 'app/config';
import styles from './UserSettingsOAuth2.css';

type Props = {
  applications: Array<any>;
  grants: Array<any>;
  deleteOAuth2Grant: (grantId: number) => Promise<void>;
  actionGrant: Array<string>;
  fetchingApplications: boolean;
  fetchingGrants: boolean;
};

const UserSettingsOAuth2 = (props: Props) => {
  const [copiedClientId, setCopiedClientId] = useState<string>('');

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
            <Tooltip content="Kopier client ID">
              <Icon
                name={copied ? 'copy' : 'copy-outline'}
                size={20}
                success={copied}
                className={styles.copyIcon}
                onClick={() => {
                  navigator.clipboard.writeText(application.clientId);
                  setCopiedClientId(application.clientId);
                  setTimeout(() => setCopiedClientId(''), 2000);
                }}
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
          onConfirm={() => props.deleteOAuth2Grant(grant.id)}
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
    <Flex column gap={15}>
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

      <p>
        <b>
          Client ID og Client secret ansees som hemmelig og må ikke inkluderes i
          kode som gjøres tiljengelig for sluttbrukere, typisk en webapp eller
          en mobilapplikasjon.
        </b>
      </p>

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
      {props.actionGrant.includes('create') && (
        <Button>
          <Link to="/users/me/settings/oauth2/new">Ny applikasjon</Link>
        </Button>
      )}
      {props.applications.length === 0 ? (
        <span>Du har ingen applikasjoner</span>
      ) : (
        <Table
          columns={applicationColumns}
          data={props.applications}
          loading={props.fetchingApplications}
          hasMore={false}
        />
      )}

      <h3>Aksepterte applikasjoner</h3>
      {props.grants.length === 0 ? (
        <span>Du har ikke logget på en app enda.</span>
      ) : (
        <Table
          columns={acceptedApplicationcolumns}
          data={props.grants}
          loading={props.fetchingGrants}
          hasMore={false}
        />
      )}
    </Flex>
  );
};

export default UserSettingsOAuth2;
