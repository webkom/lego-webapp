//@flow

import React, { Component } from 'react';
import Table from 'app/components/Table';
import Tag from 'app/components/Tags/Tag';
import { Link } from 'react-router-dom';
import Button from 'app/components/Button';
import Flex from 'app/components/Layout/Flex';
import qs from 'qs';

type Props = {
  fetching: boolean,
  hasMore: boolean,
  emailUsers: Array<Object>,
  fetch: ({ filters?: Object, next?: boolean }) => Promise<*>,
  query: Object,
  filters: Object,
  push: (Object) => void,
};

export default class EmailUsers extends Component<Props> {
  render() {
    const columns = [
      {
        title: 'Navn',
        dataIndex: 'user.fullName',
        search: true,
        inlineFiltering: false,
        render: (_, emailUser) => (
          <Link to={`/admin/email/users/${emailUser.id}`}>
            {emailUser.user.fullName}
          </Link>
        ),
      },
      {
        title: 'Brukeravn',
        dataIndex: 'user.username',
        search: true,
        inlineFiltering: false,
        render: (_, emailUser) => (
          <Link to={`/admin/email/users/${emailUser.id}`}>
            {emailUser.user.username}
          </Link>
        ),
      },
      {
        title: 'Internepost',
        dataIndex: 'internalEmail',
        search: true,
        inlineFiltering: false,
        render: (internalEmail: string) => (
          <span>{`${internalEmail}@abakus.no`}</span>
        ),
      },
      {
        title: 'Status',
        dataIndex: 'internalEmailEnabled',
        inlineFiltering: false,
        filter: [
          {
            label: 'Aktiv',
            value: 'true',
          },
          {
            label: 'Inaktiv',
            value: 'false',
          },
        ],
        render: (enabled) =>
          enabled ? (
            <Tag tag="aktiv" color="orange" />
          ) : (
            <Tag color="cyan" tag="inaktiv" />
          ),
      },
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
        <Flex justifyContent="space-between" style={{ marginBottom: '10px' }}>
          <h3>Aktive/Inaktive epostkontoer</h3>
          <Link to={'/admin/email/users/new'}>
            <Button>Ny bruker</Button>
          </Link>
        </Flex>
        <Table
          infiniteScroll
          columns={columns}
          onLoad={(filters, sort) => {
            this.props.fetch({ next: true, query: this.props.query });
          }}
          filters={this.props.filters}
          onChange={(filters, sort) => {
            this.props.push({
              search: qs.stringify({
                filters: JSON.stringify(filters),
              }),
            });
          }}
          hasMore={this.props.hasMore}
          loading={this.props.fetching}
          data={this.props.emailUsers}
        />
      </div>
    );
  }
}
