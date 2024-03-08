import { Button, ConfirmModal, Flex, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import { deletePenalty } from 'app/actions/UserActions';
import { FormatTime } from 'app/components/Time';
import { selectPenaltyByUserId } from 'app/reducers/penalties';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import styles from './Penalties.css';
import PenaltyForm from './PenaltyForm';
import type Penalty from 'app/store/models/Penalty';

type Props = {
  userId: number;
};

const Penalties = ({ userId }: Props) => {
  const penalties = useAppSelector((state) =>
    selectPenaltyByUserId(state, {
      userId,
    }),
  ) as Penalty[];
  const canDeletePenalties = useAppSelector((state) => state.allowed.penalties);

  const dispatch = useAppDispatch();

  return (
    <Flex column gap="var(--spacing-md)">
      {penalties.length ? (
        <>
          {penalties.map((penalty) => (
            <>
              <Flex key={penalty.id} column gap="var(--spacing-sm)">
                <Flex column className={styles.info}>
                  <span className={styles.weight}>
                    {penalty.weight} {penalty.weight > 1 ? 'prikker' : 'prikk'}
                  </span>
                  {penalty.sourceEvent && (
                    <span className="secondaryFontColor">
                      fra{' '}
                      <Link
                        to={`/events/${
                          penalty.sourceEvent.slug || penalty.sourceEvent.id
                        }`}
                        className={styles.eventLink}
                      >
                        {penalty.sourceEvent.title}
                      </Link>
                    </span>
                  )}
                </Flex>
                <Flex column className={styles.info}>
                  <span>Begrunnelse</span>
                  <span className="secondaryFontColor">{penalty.reason}</span>
                </Flex>
                <Flex column className={styles.info}>
                  <span>Utgår</span>
                  <FormatTime
                    time={penalty.exactExpiration}
                    className={cx('secondaryFontColor', styles.time)}
                  />
                </Flex>

                {canDeletePenalties && (
                  <ConfirmModal
                    title="Slett prikk"
                    message="Er du sikker på at du vil slette denne prikken?"
                    onConfirm={() => {
                      dispatch(deletePenalty(penalty.id));
                    }}
                    closeOnConfirm
                  >
                    {({ openConfirmModal }) => (
                      <Button danger onClick={openConfirmModal}>
                        Slett prikk
                      </Button>
                    )}
                  </ConfirmModal>
                )}
              </Flex>

              <div className={styles.divider} />
            </>
          ))}
        </>
      ) : (
        <>
          <Flex alignItems="center" gap="var(--spacing-md)">
            <Icon
              name="thumbs-up-outline"
              size={40}
              className={styles.success}
            />
            <Flex column className={cx('secondaryFontColor', styles.info)}>
              <span>Puh ...</span>
              <span>Du har ingen prikker!</span>
            </Flex>
          </Flex>

          <div className={styles.divider} />
        </>
      )}

      <PenaltyForm userId={userId} />
    </Flex>
  );
};

export default Penalties;
