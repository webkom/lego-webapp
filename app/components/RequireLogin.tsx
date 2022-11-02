type Props = {
  loggedIn: boolean;
  children?: any;
};

// DO NOT USE
function RequireLogin({
  loggedIn,
  children
}: Props) {
  if (!loggedIn) {
    return null;
  }

  return <div>{children}</div>;
}

export default RequireLogin;