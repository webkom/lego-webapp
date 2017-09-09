import React, { Component } from 'react';
import { connect } from 'react-redux';
import { uploadFile } from 'app/actions/FileActions';
import Icon from 'app/components/Icon';
import cx from 'classnames';
import styles from './Image.css';

const tooltipButtons = [
  {
    blockLayout: 'left',
    icon: 'align-left'
  },
  {
    blockLayout: 'full',
    icon: 'align-justify'
  },
  {
    blockLayout: 'right',
    icon: 'align-right'
  }
];

class ImageBlock extends Component {
  state = {
    fileKey: null,
    uploading: false,
    error: false
  };

  componentDidMount() {
    const { node } = this.props;
    const { data } = node.toJS();

    if (!data.fileKey && data.image) {
      this.uploadImage();
    }
  }

  uploadImage = () => {
    const { node, uploadFile } = this.props;
    const { data, key } = node.toJS();

    this.setState({
      ...this.state,
      uploading: true
    });

    uploadFile({ file: data.image, isPublic: data.isPublic })
      .then(({ meta }) => {
        this.setState({
          fileToken: meta.fileToken,
          fileKey: meta.fileKey,
          uploading: false,
          error: null
        });
        data.setBlockData(key, {
          ...data,
          fileKey: meta.fileKey
        });
      })
      .catch(() => {
        this.setState({
          ...this.state,
          uploading: false,
          error: true
        });
      });
  };

  retry = e => {
    e.preventDefault();
    this.uploadImage();
  };

  setBlockType = blockLayout => {
    const { node } = this.props;
    const { data, key } = node.toJS();

    data.setBlockData(key, {
      ...data,
      blockLayout
    });
  };

  render() {
    const { node, state, attributes } = this.props;
    const { uploading, error } = this.state;
    const { data } = node.toJS();
    const isFocused = state.selection.hasEdgeIn(node);
    const style = isFocused ? { border: '1px solid blue' } : {};
    return (
      <div
        className={cx(
          data.blockLayout === 'full' && styles.blockLayoutFull,
          data.blockLayout === 'right' && styles.blockLayoutRight,
          data.blockLayout === 'left' && styles.blockLayoutLeft
        )}
      >
        {uploading && <div className={styles.loader} />}

        {isFocused &&
          !uploading &&
          <div className={styles.tooltip}>
            {tooltipButtons.map(button =>
              <span
                key={button.blockLayout}
                className={styles.tooltipButton}
                onMouseDown={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  this.setBlockType(button.blockLayout);
                }}
              >
                <Icon
                  className={cx(
                    styles.tooltipIcon,
                    button.blockLayout === data.blockLayout &&
                      styles.activeTooltipIcon
                  )}
                  name={button.icon}
                />
              </span>
            )}
          </div>}

        <img
          src={data.src}
          {...attributes}
          className={styles.image}
          style={style}
        />
        {!uploading &&
          error &&
          <div className={styles.overlay}>
            <span>
              There was an error uploading the image:
              <br />
              {error}
              <br />
              <b>
                <a onClick={this.retry}>Retry?</a>
              </b>
            </span>
          </div>}
      </div>
    );
  }
}

const mapDispatchToProps = {
  uploadFile
};

export default connect(null, mapDispatchToProps)(ImageBlock);
