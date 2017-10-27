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
    );
  }
}
