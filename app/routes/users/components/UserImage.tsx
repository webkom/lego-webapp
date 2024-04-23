import { updatePicture } from 'app/actions/UserActions';
import ImageUpload from 'app/components/Upload/ImageUpload';
import { useAppDispatch } from 'app/store/hooks';
import type { User } from 'app/models';

type Props = {
  user: User;
};

const UploadPage = ({ user }: Props) => {
  const dispatch = useAppDispatch();

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
          dispatch(
            updatePicture({
              username: user.username,
              picture: file,
            }),
          )
        }
        aspectRatio={1}
        img={user.profilePicture}
      />
    </div>
  );
};

export default UploadPage;
