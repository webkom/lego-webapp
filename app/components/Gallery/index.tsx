import { chunk, get } from 'lodash';
import { PureComponent } from 'react';
import { Image } from 'app/components/Image';
import Paginator from 'app/components/Paginator';
import styles from './Gallery.module.css';
import type { ReactNode } from 'react';

export type Photo = Record<string, any>;
type Props = {
  onClick?: (arg0: Photo) => unknown;
  renderOverlay?: (arg0: Photo) => ReactNode;
  renderTop?: (arg0: Photo) => ReactNode;
  renderBottom?: (arg0: Photo) => ReactNode;
  renderEmpty?: () => ReactNode;
  margin?: number;
  loading?: boolean;
  srcKey: string;
  photos: Array<Photo>;
  hasMore: boolean;
  fetchNext: () => any;
  fetching: boolean;
};
type State = {
  containerWidth: number;
};
export default class Gallery extends PureComponent<Props, State> {
  gallery: HTMLDivElement | null | undefined;
  static defaultProps = {
    margin: 3,
  };
  state = {
    containerWidth: 0,
  };

  componentDidMount() {
    this.gallery &&
      this.setState({
        containerWidth: Math.floor(this.gallery.clientWidth),
      });
    window.addEventListener('resize', this.handleResize);
  }

  componentDidUpdate() {
    if (
      this.gallery &&
      this.gallery.clientWidth &&
      this.gallery.clientWidth !== this.state.containerWidth
    ) {
      this.setState({
        containerWidth: Math.floor(this.gallery.clientWidth),
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, false);
  }

  handleResize = () => {
    this.gallery &&
      this.setState({
        containerWidth: Math.floor(this.gallery.clientWidth),
      });
  };
  onClick = (photo: File) => {
    if (this.props.onClick) {
      this.props.onClick(photo);
    }
  };

  render() {
    const {
      margin,
      photos,
      hasMore,
      fetchNext,
      fetching,
      srcKey,
      renderOverlay,
      renderTop,
      renderEmpty,
      renderBottom,
    } = this.props;
    const { containerWidth } = this.state;
    const cols = containerWidth < 900 ? 2 : containerWidth < 550 ? 1 : 3;
    const photoNodes = chunk(photos, cols).map((column, columnIndex) => (
      <div key={columnIndex} className={styles.galleryRow}>
        {column.map((photo, rowIndex) => {
          let overlay;
          let top;
          let bottom;
          let src;

          if (srcKey) {
            src = get(photo, srcKey, 'src');
          }

          if (renderOverlay) {
            overlay = renderOverlay(photo);
          }

          if (renderTop) {
            top = renderTop(photo);
          }

          if (renderBottom) {
            bottom = renderBottom(photo);
          }

          return (
            <div
              key={photo.id}
              style={{
                margin,
              }}
              onClick={() => this.onClick(photo)}
              className={styles.galleryPhoto}
            >
              <Image
                className={styles.image}
                src={src}
                beforeLoadstyle={{
                  height: '250px',
                  width: '350px',
                }}
                onLoadStyle={{
                  height: 'auto',
                  width: '100%',
                }}
                alt={photo.alt}
              />
              <div className={styles.top}>{top}</div>
              <div className={styles.overlay}>{overlay}</div>
              <div className={styles.bottom}>{bottom}</div>
            </div>
          );
        })}
      </div>
    ));
    return (
      <div
        className={styles.galleryContainer}
        style={{
          margin: `-${String(margin)}px`,
          width: `calc(100% + ${6 * 2}px)`,
        }}
      >
        <div
          className={styles.gallery}
          ref={(c) => {
            this.gallery = c;
          }}
        >
          {fetchNext && (
            <Paginator
              infiniteScroll
              hasMore={hasMore}
              fetching={fetching}
              fetchNext={fetchNext}
            >
              {photoNodes}
            </Paginator>
          )}
          {!fetchNext && photoNodes}
          {!photos.length && !fetching && renderEmpty && renderEmpty()}
        </div>
      </div>
    );
  }
}
