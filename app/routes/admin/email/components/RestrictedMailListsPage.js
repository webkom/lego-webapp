import React, { Component } from 'react';
import Table from 'app/components/Table';
import Tag from 'app/components/Tags/Tag';
import { Link } from 'react-router';
import moment from 'moment';

type Props = {
  groupId: number,
  updateGroup: () => void
};

export default class RestrictedMailList extends Component {
  props: Props;

  render() {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        render: (id, restrictedMail) => (
          <Link to={`/admin/email/restricted/${restrictedMail.id}`}>{id}</Link>
        )
      },
      {
        title: 'Fra',
        search: true,
        dataIndex: 'fromAddress'
      },
      {
        title: 'Laget',
        dataIndex: 'createdAt',
        render: createdAt => <span>{moment(createdAt).format('lll')}</span>
      },
      {
        title: 'Brukt',
        dataIndex: 'used',
        render: used =>
          used ? (
            <Tag
              clickable={false}
              color="orange"
              tag={moment(used).format('lll')}
            />
          ) : (
            <Tag clickable={false} color="cyan" tag="Ubrukt" />
          )
      }
    ];

    return (
      <Table
        infiniteScroll
        columns={columns}
        onFetch={() => {
          this.props.fetch({ next: true });
        }}
        hasMore={this.props.hasMore}
        loading={this.props.fetching}
        data={this.props.restrictedMails}
      />
    );
  }
}
