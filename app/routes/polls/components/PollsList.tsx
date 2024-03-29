import { Button, Card, Flex, Icon } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { fetchAll } from 'app/actions/PollActions';
import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
import Paginator from 'app/components/Paginator';
import { selectAllPolls } from 'app/reducers/polls';
import { selectPaginationNext } from 'app/reducers/selectors';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { EntityType } from 'app/store/models/entities';
import styles from './PollsList.css';

const PollsList = () => {
  const polls = useAppSelector(selectAllPolls);
  const actionGrant = useAppSelector((state) => state.polls.actionGrant);
  const fetching = useAppSelector((state) => state.polls.fetching);
  const {
    pagination: { hasMore },
  } = useAppSelector(
    selectPaginationNext({
      endpoint: '/polls/',
      query: {},
      entity: EntityType.Polls,
    }),
  );

  const dispatch = useAppDispatch();

  usePreparedEffect('fetchPolls', () => dispatch(fetchAll()), []);

  return (
    <Content>
      <Helmet title="Avstemninger" />
      <NavigationTab
        title="Avstemninger"
        details={
          actionGrant.includes('create') && (
            <Link to="/polls/new">
              <Button>Lag ny</Button>
            </Link>
          )
        }
      />
      <Paginator
        hasMore={fetching || hasMore} // Paginator only shows loading indicator if hasMore is true
        fetching={fetching}
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
                <Flex>
                  <Icon name="stats-chart" size={35} className={styles.icon} />
                  <h3 className={styles.heading}>{poll.title}</h3>
                </Flex>

                <Flex wrap justifyContent="space-between">
                  <span>{`Antall stemmer: ${poll.totalVotes}`}</span>
                  <Flex alignItems="center" gap={5}>
                    {poll.hasAnswered ? (
                      <>
                        Svart
                        <Icon
                          name="checkmark-circle-outline"
                          size={20}
                          className={styles.success}
                        />
                      </>
                    ) : (
                      <>
                        Ikke svart
                        <Icon
                          name="close-circle-outline"
                          size={20}
                          style={{
                            color: 'var(--danger-color)',
                          }}
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
    </Content>
  );
};

export default PollsList;
