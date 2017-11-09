//@flow

import React, { Component } from 'react';
import Table from 'app/components/Table';
import { Link } from 'react-router';

type Props = {
  fetching: boolean,
  hasMore: boolean,
  emailLists: Array<Object>,
  fetch: ({ filters?: Object, next?: boolean }) => Promise<*>
};

export default class EmailLists extends Component<Props> {
  props: Props;

  render() {
    const columns = [
      {
        title: 'Navn',
        dataIndex: 'name',
        search: true,
        render: (name: string, emailList) => (
          <Link to={`/admin/email/lists/${emailList.id}`}>{name}</Link>
        )
      },
      {
        title: 'Epost',
        dataIndex: 'email',
        search: true,
        render: (email: string) => <span>{`${email}@abakus.no`}</span>
      }
    ];

    return (
      <div>
        <p>
          Lister brukes for permanente lister som skal mottas av definerte
          brukere eller grupper. Lister kan ikke slettes, men mottakere kan
          endres. Delen av adressen som kommer før @abakus.no er unik og kan
          ikke brukes andre steder på abakus.no. Lister er åpne og alle kan
          sende epost til disse. Ønsker brukere å sende mail fra en @abakus.no
          adresse må de få opprettet en personlig adresse under Brukere.
        </p>
        <Table
          infiniteScroll
          columns={columns}
          onLoad={(filters, sort) => {
            this.props.fetch({ next: true, filters });
          }}
          onChange={(filters, sort) => {
            this.props.fetch({ filters });
          }}
          hasMore={this.props.hasMore}
          loading={this.props.fetching}
          data={this.props.emailLists}
        />
      </div>
    );
  }
}
