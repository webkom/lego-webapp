// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import keys from 'lodash/keys';

import config from 'app/config';
import Time from 'app/components/Time';
import Button from 'app/components/Button';
import styles from './UserSettingsOAuth2.css';

type Props = {
  applications: Array<*>,
  grants: Array<*>,
  deleteOAuth2Grant: (grantId: number) => void,
  actionGrant: Array<string>
};

const UserSettingsOAuth2 = (props: Props) => {
  return (
    <div>
      <h1>OAuth2</h1>
      <p>
        Denne nettsiden benytter seg av et API som også er tiljengelig for andre
        applikasjoner. OAuth2 er samme metode som GitHub og andre benytter seg
        av for pålogging. Du kan lese mer i{' '}
        <a href={`${config.baseUrl}/docs/authentication.html#oauth2`}>
          dokumentasjonen
        </a>{' '}
        til APIet. Kontakt{' '}
        <a href="mailto:webkom@abakus.no">webkom@abakus.no</a> hvis du ønsker å
        slette en Applikasjon du har opprettet.
      </p>

      <p>
        <b>
          Client ID og Client Secret ansees om hemmelig og må ikke inkluderes i
          kode som gjøres tiljengelig for sluttbrukere, typisk en webapp eller
          en mobilapplikasjon.
        </b>
      </p>

      <br />

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

      <br />

      <h3>Applikasjoner</h3>
      {props.actionGrant.includes('create') && (
        <Link to="/users/me/settings/oauth2/new">Ny Applikasjon</Link>
      )}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Navn</th>
            <th>Beskrivelse</th>
            <th>Client ID</th>
          </tr>
        </thead>
        <tbody>
          {props.applications.map((application, key) => (
            <tr key={key}>
              <td>
                <Link to={`/users/me/settings/oauth2/${application.id}`}>
                  {application.name}
                </Link>
              </td>
              <td>{application.description}</td>
              <td>{application.clientId}</td>
            </tr>
          ))}
          {props.applications.length === 0 && (
            <tr>
              <td colSpan="3">Du har ingen applikasjoner.</td>
            </tr>
          )}
        </tbody>
      </table>

      <br />

      <h3>Akseptere Applikasjoner</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Applikasjon</th>
            <th>Utløper</th>
            <th>Token</th>
            <th>Tilganger</th>
            <th>Handlinger</th>
          </tr>
        </thead>
        <tbody>
          {props.grants.map((grant, key) =>
            grant.id ? (
              <tr key={key}>
                <td>{grant.application.name}</td>
                <td>
                  <Time time={grant.expires} format="LLL" />
                </td>
                <td>{grant.token}</td>
                <td>{keys(grant.scopes).join(', ')}</td>
                <td>
                  <Button
                    size="small"
                    onClick={() => props.deleteOAuth2Grant(grant.id)}
                  >
                    Fjern
                  </Button>
                </td>
              </tr>
            ) : null
          )}
          {props.grants.length === 0 && (
            <tr>
              <td colSpan="5">Du har ikke logget logget på en app enda.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserSettingsOAuth2;
