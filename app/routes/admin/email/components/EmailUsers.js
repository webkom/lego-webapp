//@flow

import React, { Component } from 'react';
import Table from 'app/components/Table';
import Tag from 'app/components/Tags/Tag';
import { Link } from 'react-router';

type Props = {
  fetching: boolean,
  hasMore: boolean,
  emailUsers: Array<Object>,
  fetch: ({ filters?: Object, next?: boolean }) => Promise<*>
};

export default class EmailUsers extends Component<Props> {
  props: Props;

  render() {
    const columns = [
      {
        title: 'Bruker',
        dataIndex: 'user',
        render: (user: Object, emailUser) => (
          <Link to={`/admin/email/users/${emailUser.id}`}>{user.fullName}</Link>
        )
      },
      {
        title: 'Internepost',
        dataIndex: 'internalEmail',
        search: true,
        render: (internalEmail: string) => (
          <span>{`${internalEmail}@abakus.no`}</span>
        )
      },
      {
        title: 'Status',
        dataIndex: 'internalEmailEnabled',
        render: enabled =>
          enabled ? (
            <Tag tag="aktiv" color="orange" />
          ) : (
            <Tag color="cyan" tag="inaktiv" />
          )
      }
    ];

    return (
      <div>
        <p>
          Brukere som har behov for det kan få sin egen private @abakus.no
          adresse. Denne skal være på formatet{' '}
          <b>
            fornavn.etternavn@abakus.no. Adressen kan ikke endres senere, så vær
            sikker på at adressen som settes er riktig.
          </b>{' '}
          Alle brukere med en aktivert adresse vil motta sin mail fra Abakus på
          denne. Adressen kan deaktiveres når brukeren ikke lengre er aktiv i
          Abakus, men adressen vil ikke bli tilgjengelig for andre brukere.
        </p>
        <Table
          infiniteScroll
          columns={columns}
          onLoad={() => {
            this.props.fetch({ next: true });
          }}
          hasMore={this.props.hasMore}
          loading={this.props.fetching}
          data={this.props.emailUsers}
        />
      </div>
    );
  }
}
