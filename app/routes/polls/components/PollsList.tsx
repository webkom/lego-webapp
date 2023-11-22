import {
  Button,
  Card,
  Flex,
  Icon,
  LoadingIndicator,
} from '@webkom/lego-bricks';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { fetchAll } from 'app/actions/PollActions';
import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
import Paginator from 'app/components/Paginator';
import { selectPolls } from 'app/reducers/polls';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import styles from './PollsList.css';

const PollsList = () => {
  const polls = useAppSelector(selectPolls);
  const actionGrant = useAppSelector((state) => state.polls.actionGrant);
  const fetching = useAppSelector((state) => state.polls.fetching);
  const hasMore = useAppSelector((state) => state.polls.hasMore);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);

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
        hasMore={hasMore}
        fetching={fetching}
        fetchNext={() => {
          dispatch(
            fetchAll({
              next: true,
            })
          );
        }}
      >
        <section className={styles.pollsList}>
          {polls.map((poll) => (
            <Link
              key={poll.id}
              to={`/polls/${poll.id}`}
              className={styles.pollItem}
            >
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
                          style={{
                            color: 'var(--color-green-6)',
                          }}
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
      <LoadingIndicator loading={fetching} />
    </Content>
  );
};

export default PollsList;
