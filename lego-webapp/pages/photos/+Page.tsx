import {
  BaseCard,
  CardFooter,
  HeroPage,
  Icon,
  Image,
  LinkButton,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Images, Pin, Plus } from 'lucide-react';
import { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import EmptyState from '~/components/EmptyState';
import Paginator from '~/components/Paginator';
import Time from '~/components/Time';
import { fetchGalleries } from '~/redux/actions/GalleryActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EntityType } from '~/redux/models/entities';
import { selectAllGalleries } from '~/redux/slices/galleries';
import { selectPaginationNext } from '~/redux/slices/selectors';
import useListEntranceAnimation from '~/utils/useListEntranceAnimation';
import styles from './Overview.module.css';
import type { ListGallery } from '~/redux/models/Gallery';

const AlbumListItem = ({ gallery }: { gallery: ListGallery }) => (
  <BaseCard
    component="a"
    href={`/photos/${gallery.id}#list`}
    hoverable
    shadow
    className={styles.card}
  >
    <Image
      className={styles.cover}
      src={gallery.cover?.file ?? ''}
      placeholder={gallery.cover?.thumbnail}
      alt={`Forsidebilde til ${gallery.title}`}
    />
    {gallery.isPinned && (
      <Icon
        className={styles.pinnedBadge}
        iconNode={<Pin fill="currentColor" />}
        size={18}
      />
    )}
    <div className={styles.content}>
      <h3>{gallery.title}</h3>
    </div>
    <CardFooter
      variant="border"
      justifyContent="space-between"
      className={styles.footer}
    >
      <span>{`${gallery.pictureCount} bilder`}</span>
      {gallery.takenAt && <Time time={gallery.takenAt} format="DD.MM.YYYY" />}
    </CardFooter>
  </BaseCard>
);

const Overview = () => {
  const galleries = useAppSelector(selectAllGalleries<ListGallery>);
  const { pagination } = useAppSelector(
    selectPaginationNext({
      endpoint: '/galleries/',
      entity: EntityType.Galleries,
      query: {},
    }),
  );
  const actionGrant = useAppSelector((state) => state.galleries.actionGrant);

  const dispatch = useAppDispatch();

  usePreparedEffect('fetchGalleryList', () => dispatch(fetchGalleries()), []);

  const gridRef = useRef<HTMLDivElement>(null);
  useListEntranceAnimation(
    gridRef,
    galleries.map((gallery) => gallery.id).join(),
  );

  return (
    <HeroPage
      title="Album"
      actions={
        actionGrant?.includes('create') && (
          <LinkButton dark href="/photos/new">
            <Icon iconNode={<Plus />} size={20} />
            Nytt album
          </LinkButton>
        )
      }
    >
      <Helmet title="Album" />

      <HeroPage.Section>
        {galleries.length === 0 && !pagination.fetching ? (
          <EmptyState
            iconNode={<Images />}
            header="Fant ingen synlige album ..."
            body={
              actionGrant?.includes('create') && (
                <span>
                  Trykk <a href="/photos/new">her</a> for å lage et nytt et
                </span>
              )
            }
          />
        ) : (
          <Paginator
            hasMore={pagination.fetching || pagination.hasMore}
            fetching={pagination.fetching}
            fetchNext={() => dispatch(fetchGalleries({ next: true }))}
          >
            <div ref={gridRef} className={styles.grid}>
              {galleries.map((gallery) => (
                <AlbumListItem key={gallery.id} gallery={gallery} />
              ))}
            </div>
          </Paginator>
        )}
      </HeroPage.Section>
    </HeroPage>
  );
};

export default Overview;
