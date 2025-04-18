import { ImageUpload } from '@webkom/lego-bricks';
import { updatePicture } from '~/redux/actions/UserActions';
import { useAppDispatch } from '~/redux/hooks';
import type { PublicUser } from '~/redux/models/User';

type Props = {
  user: Pick<PublicUser, 'username' | 'profilePicture'>;
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
