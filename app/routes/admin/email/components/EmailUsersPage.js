import React, { Component } from 'react';
import Table from 'app/components/Table';
import Tag from 'app/components/Tags/Tag';
import { Link } from 'react-router';

type Props = {
  groupId: number,
  updateGroup: () => void
};

export default class EmailUsersPage extends Component {
  props: Props;

  render() {
    const columns = [
      {
        title: 'Bruker',
        dataIndex: 'user',
        render: (user, emailUser) => (
          <Link to={`/admin/email/users/${emailUser.id}`}>{user.fullName}</Link>
        )
      },
      {
        title: 'Internepost',
        dataIndex: 'internalEmail',
        render: internalEmail => <span>{`${internalEmail}@abakus.no`}</span>
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
    );
  }
}
