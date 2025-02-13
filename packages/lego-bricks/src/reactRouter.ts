import type { default as ReactRouter } from 'react-router';

export const importReactRouter = async () => {
  try {
    return (await import('react-router')) as typeof ReactRouter;
  } catch (e) {
    throw new Error(
      'Unable to import react-router-dom. Make sure it is installed in your project or avoid using features that depend on it.',
    );
  }
};
