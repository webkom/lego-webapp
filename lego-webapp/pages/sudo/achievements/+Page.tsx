import {
  Button,
  ConfirmModal,
  Flex,
  LinkButton,
  Page,
} from '@webkom/lego-bricks';
import { Helmet } from 'react-helmet-async';
import ContentMain from '~/components/Content/ContentMain';
import HTTPError from '~/components/errors/HTTPError';
import { triggerAchievementRecheck } from '~/redux/actions/AchievementActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import styles from './SudoAchievements.module.css';

const SudoAchievements = () => {
  const dispatch = useAppDispatch();
  const sudoAdminAccess = useAppSelector((state) => state.allowed.sudo);
  if (!sudoAdminAccess) return <HTTPError statusCode={450} />;

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

      <ContentMain>
        <Flex
          alignItems="center"
          justifyContent="center"
          column
          width={'100%'}
          gap="var(--spacing-md)"
        >
          <ConfirmModal
            title="Bekreft resjekking av trofeer"
            message="Er du sikker på at du vil sjekke alle trofeer på nytt? Obs! Dette kan være noe krevende for serveren. Ikke spam.
"
            onConfirm={() => dispatch(triggerAchievementRecheck())}
          >
            {({ openConfirmModal }) => (
              <Button
                onPress={openConfirmModal}
                className={styles.sudoTrophyCard}
              >
                Revalider alle trofeer
              </Button>
            )}
          </ConfirmModal>
          <Button className={styles.sudoTrophyCard}>
            Tildel trofeer (coming later)
          </Button>
          <LinkButton
            className={styles.sudoTrophyCard}
            href="/sudo/achievements/tags"
          >
            Endre på tags
          </LinkButton>
        </Flex>
      </ContentMain>
    </Page>
  );
};
export default SudoAchievements;
