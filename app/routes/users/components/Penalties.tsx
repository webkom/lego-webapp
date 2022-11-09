import Button from 'app/components/Button';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';
import { FormatTime } from 'app/components/Time';
import type { AddPenalty } from 'app/models';
import PenaltyForm from './PenaltyForm';

type Penalty = {
  id: number;
  reason: string;
  weight: number;
  exactExpiration: string;
};
type Props = {
  penalties: Array<Penalty>;
  addPenalty: (arg0: AddPenalty) => void;
  deletePenalty: (arg0: number) => Promise<any>;
  username: string;
  userId: number;
  canDeletePenalties: boolean;
};

function Penalties({
  penalties,
  addPenalty,
  deletePenalty,
  username,
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
              <li
                key={penalty.id}
                style={{
                  marginBottom: '10px',
                }}
              >
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
                  <ConfirmModalWithParent
                    title="Slett prikk"
                    message="Er du sikker på at du vil slette denne prikken?"
                    onConfirm={() => deletePenalty(penalty.id)}
                  >
                    <Button flat>Slett prikk</Button>
                  </ConfirmModalWithParent>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <i>Ingen Prikker</i>
      )}
      <PenaltyForm user={userId} />
    </div>
  );
}

export default Penalties;
