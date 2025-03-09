import Auth from '~/components/Auth';

const LoginPage = ({ loginRequired }: { loginRequired?: boolean }) => {
  return <Auth asPage loginRequired={loginRequired} />;
};

export default LoginPage;
