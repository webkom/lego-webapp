import React from 'react';
import SimpleImageReplacer from '~/components/SimpleImageReplacer';

// Note: Ensure this matches your actual App component structure
function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <SimpleImageReplacer />
    </>
  );
}

export default App;