
import React from 'react';
import ImageUpload from 'app/components/Upload/ImageUpload';

type Props = {
  updatePicture: Object => void,
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
        onSubmit={file =>
          updatePicture({ username: user.username, picture: file })
        }
        aspectRatio={1}
        img={user.profilePicture}
      />
    </div>
  );
}

export default UploadPage;
