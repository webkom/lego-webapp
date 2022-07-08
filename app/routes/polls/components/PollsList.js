// @flow

import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import { Content } from 'app/components/Content';
import Icon from 'app/components/Icon';
import { Flex } from 'app/components/Layout';
import LoadingIndicator from 'app/components/LoadingIndicator';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import Paginator from 'app/components/Paginator';
import { type ActionGrant } from 'app/models';
import { type PollEntity } from 'app/reducers/polls';

import styles from './PollsList.css';

type Props = {
  polls: Array<PollEntity>,
  actionGrant: ActionGrant,
  fetching: boolean,
  hasMore: boolean,
  fetchAll: ({ next?: boolean }) => Promise<*>,
};

const PollsList = ({
  polls,
  actionGrant,
  fetchAll,
  hasMore,
  fetching,
}: Props) => (
  <Content>
    <Helmet title="Avstemninger" />
    <NavigationTab title="Avstemninger">
      {actionGrant.includes('create') && (
        <NavigationLink to="/polls/new">Lag ny</NavigationLink>
      )}
    </NavigationTab>
    <Paginator
      infiniteScroll={true}
      hasMore={hasMore}
      fetching={fetching}
      fetchNext={() => {
        fetchAll({
          next: true,
        });
      }}
    >
      <section className={styles.pollsList}>
        {polls.map((poll) => (
          <Link
            key={poll.id}
            to={`/polls/${poll.id}`}
            className={styles.pollItem}
          >
            <div className={styles.pollListItem}>
              <Flex>
                <Icon className={styles.icon} name="stats" size={40} />
                <h3 className={styles.heading}>{poll.title}</h3>
              </Flex>
              <span>{`Antall stemmer: ${poll.totalVotes}`}</span>
              {poll.hasAnswered ? (
                <span className={styles.answeredText}>
                  Svart
                  <Icon
                    name="checkmark-circle-outline"
                    size={20}
                    style={{ marginLeft: '10px', color: 'green' }}
                  />
                </span>
              ) : (
                <span className={styles.answeredText}>
                  Ikke svart
                  <Icon
                    name="close-circle"
                    size={20}
                    style={{
                      marginLeft: '10px',
                      color: 'var(--lego-link-color)',
                    }}
                  />
                </span>
              )}
            </div>
          </Link>
        ))}
      </section>
    </Paginator>
    <LoadingIndicator loading={fetching} />
  </Content>
);

export default PollsList;
