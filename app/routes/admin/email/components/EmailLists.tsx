import qs from 'qs';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from 'app/components/Button';
import Flex from 'app/components/Layout/Flex';
import Table from 'app/components/Table';
import Tag from 'app/components/Tags/Tag';

type Props = {
  fetching: boolean;
  hasMore: boolean;
  emailLists: Array<Record<string, any>>;
  fetch: (arg0: {
    query?: Record<string, any>;
    next?: boolean;
  }) => Promise<any>;
  query: Record<string, any>;
  filters: Record<string, any>;
  push: (arg0: Record<string, any>) => void;
};
export default class EmailLists extends Component<Props> {
  render() {
    const columns = [
      {
        title: 'Navn',
        dataIndex: 'name',
        search: true,
        inlineFiltering: false,
        render: (name: string, emailList) => (
          <Link to={`/admin/email/lists/${emailList.id}`}>{name}</Link>
        ),
      },
      {
        title: 'E-post',
        dataIndex: 'email',
        search: true,
        inlineFiltering: false,
        render: (email: string) => <span>{`${email}@abakus.no`}</span>,
      },
      {
        title: 'Kun for brukere med @abakus e-post',
        dataIndex: 'requireInternalAddress',
        filter: [
          {
            value: 'true',
            label: 'Kun for @abakus.no',
          },
          {
            value: 'false',
            label: 'Alle adresser',
          },
        ],
        inlineFiltering: false,
        render: (internalOnly) =>
          internalOnly ? (
            <Tag tag="Kun for @abakus.no" color="cyan" />
          ) : (
            <Tag tag="Alle typer adresser" color="yellow" />
          ),
      },
    ];
    return (
      <div>
        <p>
          Lister brukes for permanente lister som skal mottas av definerte
          brukere eller grupper. Lister kan ikke slettes, men mottakere kan
          endres. Delen av adressen som kommer før @abakus.no er unik og kan
          ikke brukes andre steder på abakus.no. Lister er åpne og alle kan
          sende e-post til disse. Ønsker brukere å sende e-post fra en
          @abakus.no adresse må de få opprettet en personlig adresse under
          Brukere.
        </p>
        <Flex
          justifyContent="space-between"
          style={{
            marginBottom: '10px',
          }}
        >
          <h3>Aktive e-postlister</h3>
          <Link to="/admin/email/lists/new">
            <Button>Ny e-postliste</Button>
          </Link>
        </Flex>
        <Table
          infiniteScroll
          columns={columns}
          onLoad={(filters, sort) => {
            this.props.fetch({
              next: true,
              query: this.props.query,
            });
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
          data={this.props.emailLists}
        />
      </div>
    );
  }
}
