//@flow

import React, { PureComponent, type Node } from 'react';
import { chunk, get } from 'lodash';
import Img from 'app/components/ProgressiveImage';
import LoadingIndicator from 'app/components/LoadingIndicator';
import Paginator from 'app/components/Paginator';
import styles from './Gallery.css';

export type Photo = Object;
type Props = {
  onClick?: Photo => mixed,
  renderOverlay?: Photo => Node,
  renderTop?: Photo => Node,
  renderBottom?: Photo => Node,
  renderEmpty?: () => Node,
  margin?: number,
  loading?: boolean,
  srcKey: string,
  photos: Array<Photo>,
  hasMore: boolean,
  fetchNext: () => void,
  fetching: boolean
};

type State = {
  containerWidth: number
};

export default class Gallery extends PureComponent<Props, State> {
  gallery: ?HTMLDivElement;

  static defaultProps = {
    margin: 3
  };

  state: State = {
    containerWidth: 0
  };

  componentDidMount() {
    this.gallery &&
      this.setState({ containerWidth: Math.floor(this.gallery.clientWidth) });
    window.addEventListener('resize', this.handleResize);
  }

  componentDidUpdate() {
    if (
      this.gallery &&
      this.gallery.clientWidth &&
      this.gallery.clientWidth !== this.state.containerWidth
    ) {
      this.setState({ containerWidth: Math.floor(this.gallery.clientWidth) });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, false);
  }

  handleResize = () => {
    this.gallery &&
      this.setState({ containerWidth: Math.floor(this.gallery.clientWidth) });
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
      loading,
      hasMore,
      fetchNext,
      fetching,
      srcKey,
      renderOverlay,
      renderTop,
      renderEmpty,
      renderBottom
    } = this.props;
    const { containerWidth } = this.state;
    let cols = 3;

    if (containerWidth < 900) {
      cols = 2;
    }

    if (containerWidth < 550) {
      cols = 1;
    }

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
              key={`${columnIndex}-${rowIndex}`}
              style={{ margin }}
              onClick={() => this.onClick(photo)}
              className={styles.galleryPhoto}
            >
              <div className={styles.top}>{top}</div>
              <Img
                src={src}
                beforeLoadstyle={{
                  height: '250px',
                  width: '350px'
                }}
                onLoadStyle={{
                  height: 'auto',
                  width: '100%'
                }}
                alt={photo.alt}
              />
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
          width: `calc(100% + ${6 * 2}px)`
        }}
      >
        <div
          className={styles.gallery}
          ref={c => {
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
