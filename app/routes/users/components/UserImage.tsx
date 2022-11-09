import ImageUpload from 'app/components/Upload/ImageUpload';

type Props = {
  updatePicture: (arg0: Record<string, any>) => void;
  user: Record<string, any>;
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
