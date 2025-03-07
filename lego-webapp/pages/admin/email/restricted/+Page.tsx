import { Card, Flex, LinkButton } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import moment from 'moment';
import { ContentMain } from '~/components/Content';
import Table from '~/components/Table';
import Tag from '~/components/Tags/Tag';
import { fetch } from '~/redux/actions/RestrictedMailActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectRestrictedMails } from '~/redux/slices/restrictedMails';
import type { ListRestrictedMail } from '~/redux/models/RestrictedMail';

const RestrictedMails = () => {
  const restrictedMails = useAppSelector<ListRestrictedMail[]>(
    selectRestrictedMails,
  );
  const fetching = useAppSelector((state) => state.restrictedMails.fetching);

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchRestrictedMails',
    () => dispatch(fetch({ next: false })),
    [],
  );

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id, restrictedMail) => (
        <a href={`/admin/email/restricted/${restrictedMail.id}`}>{id}</a>
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
      title: 'Status',
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
    <ContentMain>
      <Card severity="info">
        <p>
          Begrenset e-post benyttes når det ønskes å sende en målrettet e-post
          til en kombinasjon av grupper, brukere, møter, arrangementer eller
          definerte adresser. En begrenset e-post kan kun benyttes en gang, og
          må komme fra en forhåndsdefinert adresse. For ytterligere sikkerhet må
          en fil legges som vedlegg for verifisering av avsender. Denne filen
          vil bli validert og fjernet før e-posten sendes til mottakere.
          Begrenset e-post kan sendes med skjult avsender, og mottakere vil da
          ikke kunne svare på e-posten.
        </p>
        <ol
          style={{
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
        </ol>
      </Card>
      <Flex column gap="var(--spacing-sm)">
        <Flex alignItems="center" justifyContent="space-between">
          <h3>Dine begrensede e-poster</h3>
          <LinkButton href={'/admin/email/restricted/new'}>
            Opprett en begrenset e-post
          </LinkButton>
        </Flex>
        <Table
          columns={columns}
          onLoad={() => dispatch(fetch({ next: true }))}
          hasMore={false}
          loading={fetching}
          data={restrictedMails}
        />
      </Flex>
    </ContentMain>
  );
};

export default RestrictedMails;
