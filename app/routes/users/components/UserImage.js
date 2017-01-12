// @flow
import React from 'react';
import { connect } from 'react-redux';
import { updatePicture } from 'app/actions/UserActions';
import Upload from 'app/components/Upload';

type Props = {
  updatePicture: () => void,
  user: Object
}


function UploadPage({ updatePicture, user }: Props) {
  return (
    <div>
      <Upload
        onSubmit={(file) => updatePicture({ picture: file })}
        accept='image/*'
        user={user}
      />
    </div>
  );
}

const mapDispatchToProps = {
  updatePicture
};

export default connect(null, mapDispatchToProps)(UploadPage);
