import { Button, ConfirmModal, Flex, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { deletePenalty } from 'app/actions/UserActions';
import { FormatTime } from 'app/components/Time';
import { selectPenaltyByUserId } from 'app/reducers/penalties';
import {
  InfoField,
  LinkInfoField,
  ProfileSection,
} from 'app/routes/users/components/UserProfile/ProfileSection';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import styles from './Penalties.module.css';
import PenaltyForm from './PenaltyForm';
import type { EntityId } from '@reduxjs/toolkit';

type Props = {
  userId: EntityId;
};

const Penalties = ({ userId }: Props) => {
  const penalties = useAppSelector((state) =>
    selectPenaltyByUserId(state, userId),
  );
  const canDeletePenalties = useAppSelector((state) => state.allowed.penalties);

  const dispatch = useAppDispatch();

  return (
    <ProfileSection title="Prikker">
      {penalties.length ? (
        <>
          {penalties.map((penalty, index) => (
            <>
              <Flex key={penalty.id} column gap="var(--spacing-sm)">
                <span className={styles.weight}>
                  {penalty.weight} {penalty.weight > 1 ? 'prikker' : 'prikk'}
                </span>
                <LinkInfoField
                  name="Fra arragement"
                  to={`/events/${
                    penalty.sourceEvent.slug || penalty.sourceEvent.id
                  }`}
                >
                  {penalty.sourceEvent.title}
                </LinkInfoField>
                <InfoField name="Begrunnelse">{penalty.reason}</InfoField>
                <InfoField name="Utgår">
                  <FormatTime
                    time={penalty.exactExpiration}
                    className={cx('secondaryFontColor', styles.time)}
                  />
                </InfoField>

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
                      <Button danger onPress={openConfirmModal}>
                        Slett prikk
                      </Button>
                    )}
                  </ConfirmModal>
                )}
              </Flex>

              {index !== penalties.length - 1 && (
                <div className={styles.divider} />
              )}
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
        </>
      )}

      <PenaltyForm userId={userId} />
    </ProfileSection>
  );
};

export default Penalties;
