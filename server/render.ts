import pageRenderer from './pageRenderer';

const noSSR = (req, res) => res.send(pageRenderer());

export default require('./ssr.tsx').default;
