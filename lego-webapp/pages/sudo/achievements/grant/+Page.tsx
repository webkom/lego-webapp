import { Page, Skeleton } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Lock } from 'lucide-react';
import { useState } from 'react';
import { Field } from 'react-final-form';
import { Helmet } from 'react-helmet-async';
import {
  Form,
  LegoFinalForm,
  SelectInput,
  SubmitButton,
} from '~/components/Form';
import HTTPError from '~/components/errors/HTTPError';
import {
  fetchUserAchievements,
  grantAchievement,
  grantAchievementBulk,
  revokeAchievement,
} from '~/redux/actions/AchievementActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import {
  AchievementsInfo,
  getAchievementInfo,
  GroupedAchievementsInfo,
  MANUAL_ACHIEVEMENT_IDENTIFIERS,
  rarityMap,
} from '~/utils/achievementConstants';
import { useFeatureFlag } from '~/utils/useFeatureFlag';
import { createValidator, required } from '~/utils/validation';
import { PageChaos } from '../PageChaos';
import { WinConfirmModal } from '../WinConfirmModal';
import { useConfirmDialog } from '../useConfirmDialog';
import win95 from '../win95.module.css';
import { win95SelectStyles } from '../win95SelectStyles';
import type { EntityId } from '@reduxjs/toolkit';
import type { Achievement as AchievementModel } from '~/redux/models/User';
import type { AchievementIdentifier } from '~/utils/achievementConstants';

const TROPHY_GRANT_ALL_FLAG = 'trophy-grant-all';

type UserOption = {
  id: EntityId;
  value: EntityId;
  label: string;
  username: string;
};
type SelectOption<T> = { value: T; label: string };

const isIdentifierAllowed = (
  identifier: AchievementIdentifier,
  allowAll: boolean,
) => allowAll || MANUAL_ACHIEVEMENT_IDENTIFIERS.includes(identifier);

const useIdentifierOptions = () => {
  const allowAll = useFeatureFlag(TROPHY_GRANT_ALL_FLAG);
  const options: SelectOption<AchievementIdentifier>[] =
    GroupedAchievementsInfo.filter((group) =>
      isIdentifierAllowed(group.identifier as AchievementIdentifier, allowAll),
    ).map((group) => ({ value: group.identifier, label: group.name }));
  return { options, allowAll };
};

const levelOptionsFor = (
  identifier: AchievementIdentifier | undefined,
): SelectOption<number>[] =>
  identifier
    ? AchievementsInfo[identifier].map((data, level) => ({
        value: level,
        label: `Level ${level}: ${data.name} (${rarityMap[data.rarity].name})`,
      }))
    : [];

const WindowChrome = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className={win95.desktop}>
    <div className={win95.window}>
      <div className={win95.titleBar}>
        <span>{title}</span>
        <div className={win95.titleBarButtons}>
          <button className={win95.titleBarButton} disabled>
            _
          </button>
          <button className={win95.titleBarButton} disabled>
            □
          </button>
          <button className={win95.titleBarButton} disabled>
            ✕
          </button>
        </div>
      </div>
      {children}
    </div>
  </div>
);

type PendingAction =
  | {
      type: 'levelChange';
      achievement: AchievementModel;
      name: string;
      newLevel: number;
    }
  | { type: 'revoke'; achievement: AchievementModel; name: string }
  | {
      type: 'add';
      identifier: AchievementIdentifier;
      name: string;
      level: number;
    };

const describePendingAction = (pending: PendingAction): string => {
  switch (pending.type) {
    case 'levelChange':
      return `Sikker på at du vil endre "${pending.name}" fra level ${pending.achievement.level} til level ${pending.newLevel}?`;
    case 'revoke':
      return `Sikker på at du vil fjerne "${pending.name}" (level ${pending.achievement.level})?`;
    case 'add':
      return `Sikker på at du vil gi "${pending.name}" level ${pending.level}?`;
  }
};

const SingleUserPanel = () => {
  const dispatch = useAppDispatch();
  const { options: identifierOptions, allowAll } = useIdentifierOptions();

  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);
  const [achievements, setAchievements] = useState<AchievementModel[]>();
  const [loadingAchievements, setLoadingAchievements] = useState(false);
  const [reason, setReason] = useState('');
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null,
  );

  const canAct = selectedUser !== null && reason.trim().length > 0;

  const loadAchievements = async (userId: EntityId) => {
    setLoadingAchievements(true);
    const res = await dispatch(fetchUserAchievements(userId));
    setAchievements(res.payload);
    setLoadingAchievements(false);
  };

  const handleSelectUser = (user: UserOption | null) => {
    setSelectedUser(user);
    setAchievements(undefined);
    if (user) loadAchievements(user.id);
  };

  const handleConfirmPendingAction = async () => {
    if (!selectedUser || !pendingAction) return;
    if (pendingAction.type === 'levelChange') {
      await dispatch(
        grantAchievement({
          userId: selectedUser.id,
          identifier: pendingAction.achievement.identifier,
          level: pendingAction.newLevel,
          reason,
        }),
      );
    } else if (pendingAction.type === 'revoke') {
      await dispatch(
        revokeAchievement({
          userId: selectedUser.id,
          identifier: pendingAction.achievement.identifier,
          reason,
        }),
      );
    } else {
      await dispatch(
        grantAchievement({
          userId: selectedUser.id,
          identifier: pendingAction.identifier,
          level: pendingAction.level,
          reason,
        }),
      );
    }
    setPendingAction(null);
    loadAchievements(selectedUser.id);
  };

  return (
    <div className={win95.clientArea}>
      <fieldset className={win95.groupBox}>
        <legend className={win95.groupBoxLabel}>Bruker</legend>
        <div className={win95.row}>
          <span className={win95.label}>Bruker:</span>
          <div className={win95.field}>
            <SelectInput.WithAutocomplete
              name="user"
              placeholder="Velg bruker"
              filter={['users.user']}
              value={selectedUser}
              selectStyle={win95SelectStyles}
              onChange={(value) =>
                handleSelectUser(value as unknown as UserOption | null)
              }
            />
          </div>
        </div>
        <div className={win95.row}>
          <span className={win95.label}>Grunn:</span>
          <input
            className={cx(win95.winInput, win95.field)}
            placeholder="Påkrevd for alle handlinger under"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
      </fieldset>

      {selectedUser && loadingAchievements && <Skeleton height={100} />}

      {selectedUser && achievements && (
        <fieldset className={win95.groupBox}>
          <legend className={win95.groupBoxLabel}>Trofeer</legend>
          {achievements.length === 0 && <p>Ingen trofeer enda.</p>}
          {achievements.map((achievement) => {
            const info = getAchievementInfo(achievement);
            const rarity = info ? rarityMap[info.rarity] : undefined;
            const maxLevel =
              (AchievementsInfo[achievement.identifier]?.length ?? 1) - 1;
            const allowed = isIdentifierAllowed(
              achievement.identifier,
              allowAll,
            );
            const atMin = achievement.level <= 0;
            const atMax = achievement.level >= maxLevel;
            return (
              <div
                key={achievement.id}
                className={cx(
                  win95.achievementRow,
                  !allowed && win95.achievementRowLocked,
                )}
              >
                <span>
                  {!allowed && (
                    <span title='Ikke manuell - krever "trophy-grant-all" feature flag'>
                      <Lock size={11} className={win95.lockIcon} />
                    </span>
                  )}{' '}
                  {rarity && (
                    <span
                      className={win95.swatch}
                      style={{ backgroundColor: rarity.color }}
                      title={rarity.name}
                    />
                  )}{' '}
                  {info?.name ?? achievement.identifier} - Level{' '}
                  {achievement.level}
                  {rarity && ` (${rarity.name})`}
                </span>
                <div className={win95.winButtonRow}>
                  <button
                    className={win95.winButton}
                    disabled={!canAct || !allowed || atMin}
                    title={
                      allowed && atMin ? 'Allerede på laveste level' : undefined
                    }
                    onClick={() =>
                      setPendingAction({
                        type: 'levelChange',
                        achievement,
                        name: info?.name ?? achievement.identifier,
                        newLevel: achievement.level - 1,
                      })
                    }
                  >
                    Level ned
                  </button>
                  <button
                    className={win95.winButton}
                    disabled={!canAct || !allowed || atMax}
                    title={
                      allowed && atMax ? 'Allerede på høyeste level' : undefined
                    }
                    onClick={() =>
                      setPendingAction({
                        type: 'levelChange',
                        achievement,
                        name: info?.name ?? achievement.identifier,
                        newLevel: achievement.level + 1,
                      })
                    }
                  >
                    Level opp
                  </button>
                  <button
                    className={win95.winButton}
                    disabled={!canAct || !allowed}
                    onClick={() =>
                      setPendingAction({
                        type: 'revoke',
                        achievement,
                        name: info?.name ?? achievement.identifier,
                      })
                    }
                  >
                    Fjern
                  </button>
                </div>
              </div>
            );
          })}
        </fieldset>
      )}

      {selectedUser && (
        <LegoFinalForm
          onSubmit={(values: {
            identifier: SelectOption<AchievementIdentifier>;
            level: SelectOption<number>;
          }) => {
            setPendingAction({
              type: 'add',
              identifier: values.identifier.value,
              name: values.identifier.label,
              level: values.level.value,
            });
          }}
          validate={createValidator({
            identifier: [required()],
            level: [required()],
          })}
        >
          {({ handleSubmit, values }) => (
            <Form onSubmit={handleSubmit}>
              <fieldset className={win95.groupBox}>
                <legend className={win95.groupBoxLabel}>Legg til trofé</legend>
                <div className={win95.row}>
                  <span className={win95.label}>Trofé:</span>
                  <div className={win95.field}>
                    <Field
                      name="identifier"
                      options={identifierOptions}
                      component={SelectInput.Field}
                      selectStyle={win95SelectStyles}
                    />
                  </div>
                </div>
                <div className={win95.row}>
                  <span className={win95.label}>Level:</span>
                  <div className={win95.field}>
                    <Field
                      name="level"
                      options={levelOptionsFor(values.identifier?.value)}
                      component={SelectInput.Field}
                      selectStyle={win95SelectStyles}
                    />
                  </div>
                </div>
                <div className={win95.winButtonRow}>
                  <SubmitButton className={win95.winButton} disabled={!canAct}>
                    Legg til
                  </SubmitButton>
                </div>
              </fieldset>
            </Form>
          )}
        </LegoFinalForm>
      )}

      {pendingAction && (
        <WinConfirmModal
          title="Bekreft handling"
          message={describePendingAction(pendingAction)}
          onConfirm={handleConfirmPendingAction}
          onCancel={() => setPendingAction(null)}
        />
      )}
    </div>
  );
};

const BulkGrantPanel = () => {
  const dispatch = useAppDispatch();
  const { options: identifierOptions } = useIdentifierOptions();
  const [selectedUsers, setSelectedUsers] = useState<UserOption[]>([]);
  const bulkConfirm = useConfirmDialog();

  return (
    <div className={win95.clientArea}>
      <fieldset className={win95.groupBox}>
        <legend className={win95.groupBoxLabel}>Mottakere</legend>
        <SelectInput.WithAutocomplete
          name="users"
          placeholder="Velg brukere"
          filter={['users.user']}
          isMulti
          value={selectedUsers}
          selectStyle={win95SelectStyles}
          onChange={(value) =>
            setSelectedUsers((value as unknown as UserOption[]) ?? [])
          }
        />
      </fieldset>

      <LegoFinalForm
        onSubmit={async (values: {
          identifier: SelectOption<AchievementIdentifier>;
          level: SelectOption<number>;
          reason: string;
        }) => {
          await dispatch(
            grantAchievementBulk({
              userIds: selectedUsers.map((user) => user.id),
              identifier: values.identifier.value,
              level: values.level.value,
              reason: values.reason,
            }),
          );
          setSelectedUsers([]);
        }}
        validate={createValidator({
          identifier: [required()],
          level: [required()],
          reason: [required()],
        })}
      >
        {({ handleSubmit, values }) => {
          // onConfirm runs the form's own validated submit (handleSubmit),
          // so a missing identifier/level/reason blocks the grant here the
          // same way it would on a plain submit button.
          const openBulkConfirm = () =>
            bulkConfirm.requestConfirm(
              'Bekreft massetildeling av trofé',
              `Er du sikker på at du vil gi "${
                values.identifier?.label ?? '...'
              }" level ${
                values.level !== undefined ? values.level.value : '...'
              } til ${selectedUsers.length} bruker(e)? Dette kan ikke angres automatisk.`,
              async () => {
                await handleSubmit();
              },
            );
          return (
            <Form onSubmit={handleSubmit}>
              <fieldset className={win95.groupBox}>
                <legend className={win95.groupBoxLabel}>Trofé</legend>
                <div className={win95.row}>
                  <span className={win95.label}>Trofé:</span>
                  <div className={win95.field}>
                    <Field
                      name="identifier"
                      options={identifierOptions}
                      component={SelectInput.Field}
                      selectStyle={win95SelectStyles}
                    />
                  </div>
                </div>
                <div className={win95.row}>
                  <span className={win95.label}>Level:</span>
                  <div className={win95.field}>
                    <Field
                      name="level"
                      options={levelOptionsFor(values.identifier?.value)}
                      component={SelectInput.Field}
                      selectStyle={win95SelectStyles}
                    />
                  </div>
                </div>
                <div className={win95.row}>
                  <span className={win95.label}>Grunn:</span>
                  <Field
                    name="reason"
                    component="input"
                    className={cx(win95.winInput, win95.field)}
                  />
                </div>

                <div className={win95.winButtonRow}>
                  <button
                    type="button"
                    className={win95.winButton}
                    disabled={
                      selectedUsers.length === 0 ||
                      !values.identifier ||
                      values.level === undefined ||
                      !values.reason
                    }
                    onClick={openBulkConfirm}
                  >
                    Tildel til {selectedUsers.length} bruker(e)
                  </button>
                </div>

                {bulkConfirm.dialog}
              </fieldset>
            </Form>
          );
        }}
      </LegoFinalForm>
    </div>
  );
};

const SudoAchievementsGrant = () => {
  const sudoAdminAccess = useAppSelector((state) => state.allowed.sudo);
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  if (!sudoAdminAccess) return <HTTPError statusCode={450} />;

  return (
    <Page title="Tildel trofeer" back={{ href: '/sudo/achievements' }}>
      <Helmet title={'Tildel trofeer'} />
      <PageChaos />
      <WindowChrome title="Tildel trofeer - Egenskaper">
        <div className={win95.tabList}>
          <button
            className={cx(
              win95.tabButton,
              mode === 'single' && win95.tabButtonActive,
            )}
            onClick={() => setMode('single')}
          >
            Enkeltbruker
          </button>
          <button
            className={cx(
              win95.tabButton,
              mode === 'bulk' && win95.tabButtonActive,
            )}
            onClick={() => setMode('bulk')}
          >
            Alle valgte brukere
          </button>
        </div>
        {mode === 'single' ? <SingleUserPanel /> : <BulkGrantPanel />}
        <div className={win95.statusBar}>Klar</div>
      </WindowChrome>
    </Page>
  );
};

export default SudoAchievementsGrant;
