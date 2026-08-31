import { Flex, Page } from '@webkom/lego-bricks';
import { RefreshCw, Tag, Trophy } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { navigate } from 'vike/client/router';
import ContentMain from '~/components/Content/ContentMain';
import HTTPError from '~/components/errors/HTTPError';
import { triggerAchievementRecheck } from '~/redux/actions/AchievementActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { PageChaos } from './PageChaos';
import { useConfirmDialog } from './useConfirmDialog';
import win95 from './win95.module.css';

type Applet = {
  key: string;
  label: string;
  iconNode: React.ReactNode;
  onOpen: () => void;
};

const SudoAchievements = () => {
  const dispatch = useAppDispatch();
  const sudoAdminAccess = useAppSelector((state) => state.allowed.sudo);
  const recheckConfirm = useConfirmDialog();
  if (!sudoAdminAccess) return <HTTPError statusCode={450} />;

  const openRecheckConfirm = () =>
    recheckConfirm.requestConfirm(
      'Bekreft resjekking av trofeer',
      'Er du sikker på at du vil sjekke alle trofeer på nytt? Obs! Dette kan være noe krevende for serveren. Ikke spam.',
      () => {
        dispatch(triggerAchievementRecheck());
      },
    );

  const applets: Applet[] = [
    {
      key: 'grant',
      label: 'Tildel trofeer',
      iconNode: <Trophy size={20} />,
      onOpen: () => navigate('/sudo/achievements/grant'),
    },
    {
      key: 'tags',
      label: 'Trofé-tags',
      iconNode: <Tag size={20} />,
      onOpen: () => navigate('/sudo/achievements/tags'),
    },
  ];

  return (
    <Page
      title={
        <Flex alignItems="center" gap="var(--spacing-sm)">
          Sudo Trofeer
        </Flex>
      }
      back={{ href: '/sudo' }}
    >
      <Helmet title={'Sudo Trofeer'} />

      <PageChaos />

      <ContentMain>
        <div className={win95.desktop}>
          <div className={win95.window}>
            <div className={win95.titleBar}>
              <span>Trofeer - Kontrollpanel</span>
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

            <div className={win95.clientArea}>
              <div className={win95.iconGrid}>
                {applets.map((applet) => (
                  <button
                    key={applet.key}
                    className={win95.iconTile}
                    onClick={applet.onOpen}
                  >
                    <span className={win95.iconGlyph}>{applet.iconNode}</span>
                    <span className={win95.iconLabel}>{applet.label}</span>
                  </button>
                ))}

                <button className={win95.iconTile} onClick={openRecheckConfirm}>
                  <span className={win95.iconGlyph}>
                    <RefreshCw size={20} />
                  </span>
                  <span className={win95.iconLabel}>
                    Revalider alle trofeer
                  </span>
                </button>
              </div>
            </div>

            <div className={win95.statusBar}>{applets.length + 1} objekter</div>
          </div>
        </div>
      </ContentMain>

      {recheckConfirm.dialog}
    </Page>
  );
};
export default SudoAchievements;
