import React from 'react';
import { uploadFile } from 'app/actions/FileActions';
import { connect } from 'react-redux';
import styles from '../Editor.css';

class ImageBlock extends React.Component<Props, State> {
  componentDidMount() {
    if (this.props.file) {
      this.props
        .uploadFile({ file: this.props.file, isPublic: true })
        .then(({ meta }) => {
          const { editor, file, imageUrl } = this.props;
          editor.setNodeByKey(this.props.node.key, {
            data: { imageUrl, file, fileKey: meta.fileToken.split(':')[0] },
            type: 'image'
          });
        });
    }
  }

  render() {
    const { imageUrl, src, attributes, isFocused } = this.props;
    return (
      <img
        onLoad={() => URL.revokeObjectURL(imageUrl)}
        src={src ? src : imageUrl}
        alt="Bildet kunne ikke vises"
        className={isFocused && styles.imgSelected}
        {...attributes}
      />
    );
  }
}

export default connect(
  null,
  { uploadFile }
)(ImageBlock);
