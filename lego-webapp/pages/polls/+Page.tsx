import { Card, Flex, HeroPage, Icon, LinkButton } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import cx from 'classnames';
import { CircleCheck, CircleX, Plus } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Paginator from '~/components/Paginator';
import Tag from '~/components/Tags/Tag';
import Time from '~/components/Time';
import { fetchAll } from '~/redux/actions/PollActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EntityType } from '~/redux/models/entities';
import { selectAllPolls } from '~/redux/slices/polls';
import { selectPaginationNext } from '~/redux/slices/selectors';
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
    <HeroPage
      title="Avstemninger"
      actions={
        actionGrant.includes('create') && (
          <LinkButton dark href="/polls/new">
            <Icon iconNode={<Plus />} size={20} />
            Ny avstemning
          </LinkButton>
        )
      }
    >
      <Helmet title="Avstemninger" />
      <HeroPage.Section>
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
              <a key={poll.id} href={`/polls/${poll.id}`}>
                <Card isHoverable className={styles.pollListItem}>
                  <Flex justifyContent="space-between">
                    <Card.Header>{poll.title}</Card.Header>
                    <div
                      className={cx(styles.pollDate, styles.largeViewportOnly)}
                    >
                      <Time time={poll.createdAt} wordsAgo />
                    </div>
                  </Flex>
                  <div
                    className={cx(styles.pollDate, styles.smallViewportOnly)}
                  >
                    <Time time={poll.createdAt} wordsAgo />
                  </div>

                  <Flex wrap justifyContent="space-between" alignItems="center">
                    <span>{`${poll.totalVotes} ${poll.totalVotes === 1 ? 'stemme' : 'stemmer'}`}</span>
                    {poll.hasAnswered ? (
                      <Tag
                        tag="Svart"
                        color="green"
                        iconNode={<CircleCheck />}
                      />
                    ) : (
                      <Tag
                        tag="Ikke svart"
                        color="red"
                        iconNode={<CircleX />}
                      />
                    )}
                  </Flex>
                </Card>
              </a>
            ))}
          </section>
        </Paginator>
      </HeroPage.Section>
    </HeroPage>
  );
};

export default PollsList;
