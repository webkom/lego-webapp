import ImageUpload from 'app/components/Upload/ImageUpload';
import type { User } from 'app/models';

type Props = {
  updatePicture: ({
    picture,
    username,
  }: {
    picture: File;
    username: string;
  }) => void;
  user: User;
};

function UploadPage({ updatePicture, user }: Props) {
  return (
    <div
      style={{
        width: 250,
        height: 250,
        borderRadius: 250 / 2,
      }}
    >
      <ImageUpload
        onSubmit={(file) =>
          updatePicture({
            username: user.username,
            picture: file,
          })
        }
        aspectRatio={1}
        img={user.profilePicture}
      />
    </div>
  );
}

export default UploadPage;
