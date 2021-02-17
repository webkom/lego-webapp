//@flow
import { Component } from 'react';
import Table from 'app/components/Table';
import Tag from 'app/components/Tags/Tag';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Button from 'app/components/Button';
import Flex from 'app/components/Layout/Flex';

type Props = {
  fetching: boolean,
  hasMore: boolean,
  restrictedMails: Array<Object>,
  fetch: ({ filters?: Object, next?: boolean }) => Promise<*>,
};

export default class RestrictedMails extends Component<Props> {
  render() {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        render: (id, restrictedMail) => (
          <Link to={`/admin/email/restricted/${restrictedMail.id}`}>{id}</Link>
        ),
      },
      {
        title: 'Fra',
        search: true,
        dataIndex: 'fromAddress',
      },
      {
        title: 'Laget',
        dataIndex: 'createdAt',
        render: (createdAt) => <span>{moment(createdAt).format('lll')}</span>,
      },
      {
        title: 'Brukt',
        dataIndex: 'used',
        render: (used) =>
          used ? (
            <Tag
              clickable={false}
              color="orange"
              tag={moment(used).format('lll')}
            />
          ) : (
            <Tag clickable={false} color="cyan" tag="Ubrukt" />
          ),
      },
    ];

    return (
      <div>
        <p>
          Begrenset epost benyttes om det ønskes å sende en målrettet epost til
          en kombinasjon av grupper, brukere, møter, arrangementer eller
          definerte adresser. En begrenset epost kan kun benyttes en gang, og må
          komme fra en forhåndsdefinert adresse. For ytterligere sikkerhet må en
          fil legges som vedlegg for verifisering av avsender. Denne filen vil
          bli validert og fjernet før eposten sendes til mottakere. Begrenset
          epost kan sendes med skult avsender, mottakere vil da ikke kunne svare
          på eposten.
          <ul style={{ listStyleType: 'circle', listStylePosition: 'inside' }}>
            <li>Opprett en begrenset epost</li>
            <li>Last ned epost token</li>
            <li>Opprett en epost med oppgitt avsender</li>
            <li>
              Mottaker settes til <b>restricted@abakus.no</b>
            </li>
            <li>Legg inn epost token som vedlegg</li>
            <li>Send eposten</li>
          </ul>
        </p>
        <Flex justifyContent="space-between" style={{ marginBottom: '10px' }}>
          <h3>Dine begrensede e-poster</h3>
          <Link to={'/admin/email/restricted/new'}>
            <Button>Ny begrenset epost</Button>
          </Link>
        </Flex>
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
      </div>
    );
  }
}
