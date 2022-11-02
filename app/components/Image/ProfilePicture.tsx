import CircularPicture from "./CircularPicture";
import type { User } from "app/models";
import "app/models";
type Props = {
  user: User;
  alt: string;
  size: number;
  style?: Record<string, any>;
};

const ProfilePicture = ({
  alt,
  user,
  size = 100,
  style,
  ...props
}: Props) => <CircularPicture alt={alt} src={user.profilePicture} placeholder={user.profilePicturePlaceholder} size={size} style={style} {...(props as Record<string, any>)} />;

export default ProfilePicture;