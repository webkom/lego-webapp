import pageRenderer from './pageRenderer';

const noSSR = (req, res) => res.send(pageRenderer());
export default __DEV__ ? noSSR : require('./ssr.js').default;
