import Button from 'app/components/Button';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';
import { FormatTime } from 'app/components/Time';
import type { AddPenalty, Penalty } from 'app/models';
import PenaltyForm from './PenaltyForm';

type Props = {
  penalties: Array<Penalty>;
  addPenalty: (arg0: AddPenalty) => void;
  deletePenalty: (arg0: number) => Promise<void>;
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
                    closeOnConfirm
                  >
                    <Button flat>Slett prikk</Button>
                  </ConfirmModalWithParent>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <i>Ingen prikker</i>
      )}
      <PenaltyForm user={userId} />
    </div>
  );
}

export default Penalties;
