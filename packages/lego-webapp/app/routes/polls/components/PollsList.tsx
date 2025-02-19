import { Card, Flex, Icon, LinkButton, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { CircleCheck, CircleX } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { fetchAll } from 'app/actions/PollActions';
import Paginator from 'app/components/Paginator';
import { selectAllPolls } from 'app/reducers/polls';
import { selectPaginationNext } from 'app/reducers/selectors';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { EntityType } from 'app/store/models/entities';
import styles from './PollsList.module.css';

const PollsList = () => {
  const polls = useAppSelector(selectAllPolls);
  const actionGrant = useAppSelector((state) => state.polls.actionGrant);
  const { pagination } = useAppSelector(
    selectPaginationNext({
      endpoint: '/polls/',
      query: {},
      entity: EntityType.Polls,
    }),
  );

  const dispatch = useAppDispatch();

  usePreparedEffect('fetchPolls', () => dispatch(fetchAll()), []);

  return (
    <Page
      title="Avstemninger"
      actionButtons={
        actionGrant.includes('create') && (
          <LinkButton href="/polls/new">Lag ny</LinkButton>
        )
      }
    >
      <Helmet title="Avstemninger" />
      <Paginator
        hasMore={pagination.fetching || pagination.hasMore} // Paginator only shows loading indicator if hasMore is true
        fetching={pagination.fetching}
        fetchNext={() => {
          dispatch(
            fetchAll({
              next: true,
            }),
          );
        }}
      >
        <section className={styles.pollsList}>
          {polls.map((poll) => (
            <Link key={poll.id} to={`/polls/${poll.id}`}>
              <Card isHoverable className={styles.pollListItem}>
                <Card.Header>{poll.title}</Card.Header>

                <Flex wrap justifyContent="space-between" alignItems="center">
                  <span>{`${poll.totalVotes} ${poll.totalVotes === 1 ? 'stemme' : 'stemmer'}`}</span>
                  <Flex alignItems="center" gap="var(--spacing-sm)">
                    {poll.hasAnswered ? (
                      <>
                        Svart
                        <Icon
                          iconNode={<CircleCheck />}
                          size={21}
                          className={styles.success}
                        />
                      </>
                    ) : (
                      <>
                        Ikke svart
                        <Icon
                          iconNode={<CircleX />}
                          size={21}
                          className={styles.danger}
                        />
                      </>
                    )}
                  </Flex>
                </Flex>
              </Card>
            </Link>
          ))}
        </section>
      </Paginator>
    </Page>
  );
};

export default PollsList;
