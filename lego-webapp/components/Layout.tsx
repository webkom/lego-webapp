
import SimpleImageReplacer from '~/components/SimpleImageReplacer';

const Layout = ({ children }) => {
  return (
    <>
      {children}
      <SimpleImageReplacer />
    </>
  );
};

export default Layout;