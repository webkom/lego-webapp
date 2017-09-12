//@flow

import React, { PureComponent } from 'react';
import { chunk, get } from 'lodash';
import LoadingIndicator from '../LoadingIndicator';
import styles from './Gallery.css';

type Props = {
  onClick?: (object, event) => void,
  renderOverlay?: () => void,
  renderTop?: () => void,
  renderBottom?: () => void,
  renderEmpty?: ReactElement,
  margin?: number,
  loading: boolean,
  srcKey: string,
  photos: []
};

type State = {
  containerWidth: number
};

export default class Gallery extends PureComponent {
  props: Props;

  static defaultProps = {
    margin: 3
  };

  state: State = {
    containerWidth: 0
  };

  componentDidMount() {
    this.setState({ containerWidth: Math.floor(this.gallery.clientWidth) });
    window.addEventListener('resize', this.handleResize);
  }

  componentDidUpdate() {
    if (this.gallery.clientWidth !== this.state.containerWidth) {
      this.setState({ containerWidth: Math.floor(this.gallery.clientWidth) });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, false);
  }

  handleResize = () => {
    this.setState({ containerWidth: Math.floor(this.gallery.clientWidth) });
  };

  onClick = photo => {
    if (this.props.onClick) {
      this.props.onClick(photo);
    }
  };

  render() {
    const {
      margin,
      photos,
      loading,
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
              <img src={src} alt={photo.alt} />
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
        style={{ margin: `-${margin}px`, width: `calc(100% + ${6 * 2}px)` }}
      >
        <div
          className={styles.gallery}
          ref={c => {
            this.gallery = c;
          }}
        >
          {photoNodes}
          {!photos.length && renderEmpty}
        </div>
        <LoadingIndicator loading={loading} />
      </div>
    );
  }
}
