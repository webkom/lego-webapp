import { Button, ConfirmModal } from '@webkom/lego-bricks';
import { FormatTime } from 'app/components/Time';
import type { Penalty } from 'app/models';
import styles from './Penalties.css';
import PenaltyForm from './PenaltyForm';

type Props = {
  penalties: Array<Penalty>;
  deletePenalty: (arg0: number) => Promise<void>;
  userId: number;
  canDeletePenalties: boolean;
};

function Penalties({
  penalties,
  deletePenalty,
  userId,
  canDeletePenalties,
}: Props) {
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
                    onConfirm={() => deletePenalty(penalty.id)}
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
      <PenaltyForm user={userId} />
    </div>
  );
}

export default Penalties;
