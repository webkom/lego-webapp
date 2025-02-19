import Auth from 'app/components/Auth';

const LoginPage = ({ loginRequired }: { loginRequired?: boolean }) => {
  return <Auth asPage loginRequired={loginRequired} />;
};

export default LoginPage;
