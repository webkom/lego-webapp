import { Button } from '@webkom/lego-bricks';
import moment from 'moment';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import Flex from 'app/components/Layout/Flex';
import Table from 'app/components/Table';
import Tag from 'app/components/Tags/Tag';

type Props = {
  fetching: boolean;
  hasMore: boolean;
  restrictedMails: Array<Record<string, any>>;
  fetch: (arg0: {
    filters?: Record<string, any>;
    next?: boolean;
  }) => Promise<any>;
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
            <Tag tag={moment(used).format('lll')} color="gray" />
          ) : (
            <Tag tag="Ubrukt" color="yellow" />
          ),
      },
    ];
    return (
      <div>
        <p>
          Begrenset e-post benyttes om det ønskes å sende en målrettet e-post
          til en kombinasjon av grupper, brukere, møter, arrangementer eller
          definerte adresser. En begrenset e-post kan kun benyttes en gang, og
          må komme fra en forhåndsdefinert adresse. For ytterligere sikkerhet må
          en fil legges som vedlegg for verifisering av avsender. Denne filen
          vil bli validert og fjernet før e-posten sendes til mottakere.
          Begrenset e-post kan sendes med skult avsender, mottakere vil da ikke
          kunne svare på e-posten.
          <ul
            style={{
              listStyleType: 'circle',
              listStylePosition: 'inside',
            }}
          >
            <li>Opprett en begrenset e-post</li>
            <li>Last ned e-post token</li>
            <li>Opprett en e-post med oppgitt avsender</li>
            <li>
              Mottaker settes til <b>restricted@abakus.no</b>
            </li>
            <li>Legg inn e-post token som vedlegg</li>
            <li>Send e-posten</li>
          </ul>
        </p>
        <Flex
          justifyContent="space-between"
          style={{
            marginBottom: '10px',
          }}
        >
          <h3>Dine begrensede e-poster</h3>
          <Link to={'/admin/email/restricted/new'}>
            <Button>Ny begrenset e-post</Button>
          </Link>
        </Flex>
        <Table
          infiniteScroll
          columns={columns}
          onFetch={() => {
            this.props.fetch({
              next: true,
            });
          }}
          hasMore={this.props.hasMore}
          loading={this.props.fetching}
          data={this.props.restrictedMails}
        />
      </div>
    );
  }
}
