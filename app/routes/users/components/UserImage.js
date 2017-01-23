// @flow
import React from 'react';
import { connect } from 'react-redux';
import { updatePicture } from 'app/actions/UserActions';
import { ImageUpload } from 'app/components/Upload';

type Props = {
  updatePicture: () => void,
  user: Object
}


function UploadPage({ updatePicture, user }: Props) {
  return (
    <div style={{
      width: 250,
      height: 250,
      borderRadius: 250 / 2
    }}>
      <ImageUpload
        onSubmit={(file) => updatePicture({ picture: file })}
        aspectRatio={1}
        img={user.picture}
      />
    </div>
  );
}

const mapDispatchToProps = {
  updatePicture
};

export default connect(null, mapDispatchToProps)(UploadPage);
