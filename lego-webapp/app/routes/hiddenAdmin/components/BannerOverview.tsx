import {
  Button,
  ButtonGroup,
  Card,
  ConfirmModal,
  Flex,
  Icon,
  LinkButton,
  Page,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Globe, Lock } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import HTTPError from 'app/routes/errors';
import { ContentSection, ContentMain } from '~/components/Content';
import {
  deleteBanner,
  editBanner,
  fetchAllBanners,
} from '~/redux/actions/BannerActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectAllBanners } from '~/redux/slices/banner';
import { guardLogin } from '~/utils/replaceUnlessLoggedIn';

const BannerOverview = () => {
  const dispatch = useAppDispatch();
  usePreparedEffect('fetchAllBanners', () => dispatch(fetchAllBanners()), [
    dispatch,
  ]);
  const allBanners = useAppSelector((state) => selectAllBanners(state));
  const sudoAdminAccess = useAppSelector((state) => state.allowed.sudo);
  if (!sudoAdminAccess) return <HTTPError statusCode={418} />;

  return (
    <Page
      title={'Bannere'}
      actionButtons={
        <LinkButton href={`/admin/banners/create/`}>Lag ny</LinkButton>
      }
      back={sudoAdminAccess ? { href: '/sudo' } : { href: '/' }}
    >
      <Helmet title={'Bannere'} />
      <ContentSection>
        <ContentMain>
          {allBanners.map((b) => (
            <Card key={b.id}>
              <Flex alignItems="center" justifyContent="space-between">
                <Flex column>
                  <h2>Tittel: {b.header}</h2>
                  <h3>Undertittel: {b.subheader}</h3>
                  <p>
                    Lenke: <a href={b.link}>{b.link}</a>
                  </p>
                  <ButtonGroup>
                    <LinkButton href={`/admin/banners/edit/${b.id}/`}>
                      Rediger
                    </LinkButton>
                    <ConfirmModal
                      title="Bekreft sletting av banner"
                      message="Er du sikker på at du vil slette dette banneret?"
                      onConfirm={() => dispatch(deleteBanner(b.id))}
                    >
                      {({ openConfirmModal }) => (
                        <Button onPress={openConfirmModal} danger>
                          Slett
                        </Button>
                      )}
                    </ConfirmModal>
                  </ButtonGroup>
                </Flex>
                <Flex>
                  <Icon
                    iconNode={
                      <Globe
                        color={b.currentPublic ? '#13a452' : 'gray'}
                        onClick={() => {
                          dispatch(
                            editBanner(
                              { currentPublic: !b.currentPublic },
                              b.id,
                            ),
                          ).then(() => dispatch(fetchAllBanners()));
                        }}
                      />
                    }
                    size={25}
                    color="green"
                    style={{ cursor: 'pointer' }}
                  />

                  <Icon
                    iconNode={
                      <Lock color={b.currentPrivate ? '#13a452' : 'gray'} />
                    }
                    size={25}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      dispatch(
                        editBanner({ currentPrivate: !b.currentPrivate }, b.id),
                      ).then(() => dispatch(fetchAllBanners()));
                    }}
                  />
                </Flex>
              </Flex>
            </Card>
          ))}
        </ContentMain>
      </ContentSection>
    </Page>
  );
};

export default guardLogin(BannerOverview);
