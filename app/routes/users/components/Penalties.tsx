import { Button, ConfirmModal } from '@webkom/lego-bricks';
import { deletePenalty } from 'app/actions/UserActions';
import { FormatTime } from 'app/components/Time';
import { useAppDispatch } from 'app/store/hooks';
import styles from './Penalties.css';
import PenaltyForm from './PenaltyForm';
import type { Penalty } from 'app/models';

type Props = {
  penalties: Array<Penalty>;
  userId: number;
  canDeletePenalties: boolean;
};

const Penalties = ({ penalties, userId, canDeletePenalties }: Props) => {
  const dispatch = useAppDispatch();

  return (
    <div>
      {penalties.length ? (
        <ul>
          {penalties.map((penalty) => {
            const word = penalty.weight > 1 ? 'prikker' : 'prikk';
            return (
              <li key={penalty.id} className={styles.penalty}>
                <div>
                  <strong>
                    {penalty.weight} {word}
                  </strong>
                </div>
                <>
                  Begrunnelse: <i>{penalty.reason}</i>
                </>
                <div>
                  Utgår:{' '}
                  <i>
                    <FormatTime time={penalty.exactExpiration} />
                  </i>
                </div>
                {canDeletePenalties && (
                  <ConfirmModal
                    title="Slett prikk"
                    message="Er du sikker på at du vil slette denne prikken?"
                    onConfirm={() => dispatch(deletePenalty(penalty.id))}
                    closeOnConfirm
                  >
                    {({ openConfirmModal }) => (
                      <Button danger onClick={openConfirmModal}>
                        Slett prikk
                      </Button>
                    )}
                  </ConfirmModal>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <span className="secondaryFontColor">Ingen prikker</span>
      )}
      <PenaltyForm userId={userId} />
    </div>
  );
};

export default Penalties;
