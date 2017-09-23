// @flow
import React from 'react';
import ImageUpload from 'app/components/Upload/ImageUpload';

type Props = {
  updatePicture: () => void,
  user: Object
};

function UploadPage({ updatePicture, user }: Props) {
  return (
    <div
      style={{
        width: 250,
        height: 250,
        borderRadius: 250 / 2
      }}
    >
      <ImageUpload
        onSubmit={file => updatePicture({ picture: file })}
        aspectRatio={1}
        img={user.profilePicture}
      />
    </div>
  );
}

export default UploadPage;
