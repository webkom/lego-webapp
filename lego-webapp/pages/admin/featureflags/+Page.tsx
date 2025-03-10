import { ButtonGroup, Card, Flex, LinkButton, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { ContentMain, ContentSection } from '~/components/Content';
import ToggleSwitch from '~/components/Form/ToggleSwitch';
import HTTPError from '~/components/errors/HTTPError';
import {
  editFeatureFlag,
  fetchAdminAllFeatureFlags,
} from '~/redux/actions/FeatureFlagActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectAllAdminFeatureFlags } from '~/redux/slices/featureFlags';
import { guardLogin } from '~/utils/replaceUnlessLoggedIn';

const FeatureFlagOverview = () => {
  const dispatch = useAppDispatch();
  usePreparedEffect(
    'fetchAllFeatureFlags',
    () => dispatch(fetchAdminAllFeatureFlags()),
    [dispatch],
  );
  const allFlags = useAppSelector((state) => selectAllAdminFeatureFlags(state));
  const sudoAdminAccess = useAppSelector((state) => state.allowed.sudo);
  if (!sudoAdminAccess) return <HTTPError statusCode={402} />;

  return (
    <Page
      title={'Feature flagg'}
      back={sudoAdminAccess ? { href: '/sudo' } : { href: '/' }}
      actionButtons={
        <LinkButton href={`/admin/featureflags/new`}>Lag ny</LinkButton>
      }
    >
      <Helmet title={'Feature flagg'} />
      <ContentSection>
        <ContentMain>
          {allFlags.map((flag) => (
            <Card key={flag.identifier}>
              <Flex justifyContent="space-between">
                <h2>{flag.identifier}</h2>
                <ButtonGroup>
                  <Flex
                    column
                    gap="var(--spacing-sm)"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <h4>Aktiver</h4>
                    <ToggleSwitch
                      onChange={(isSelected) =>
                        dispatch(
                          editFeatureFlag({ isActive: isSelected }, flag.id),
                        )
                      }
                      checked={flag.isActive}
                    />
                  </Flex>

                  <LinkButton href={`/admin/featureflags/${flag.id}/edit/`}>
                    Rediger
                  </LinkButton>
                </ButtonGroup>
              </Flex>
            </Card>
          ))}
        </ContentMain>
      </ContentSection>
    </Page>
  );
};

export default guardLogin(FeatureFlagOverview);
