import { useEffect, useState } from 'react';
import { Link as AriaLink } from 'react-aria-components';
import { importReactRouter } from '../../reactRouter';
import type { ComponentProps } from 'react';

/**
 * A button that uses react-router-dom's useNavigate hook to navigate to a new page, allowing for state to be passed.
 * The code is a bit convoluted because we need to lazy-import react-router-dom to avoid importing it in projects that don't use it.
 */
type ReactRouter = Awaited<ReturnType<typeof importReactRouter>>;

const ReactRouterLinkButton = (
  props: ComponentProps<typeof AriaLink> & { state: unknown },
) => {
  const [reactRouter, setReactRouter] = useState<ReactRouter>();
  useEffect(() => {
    if (!reactRouter) {
      importReactRouter().then(setReactRouter).catch(console.error);
    }
  }, [reactRouter]);

  return reactRouter ? (
    <ImportedReactRouterLinkButton reactRouter={reactRouter} {...props} />
  ) : (
    <AriaLink {...props} />
  );
};

// This needs to be a separate component so that we can run the useNavigate hook only when react-router-dom is loaded
const ImportedReactRouterLinkButton = ({
  href,
  state,
  children,
  reactRouter,
  ...props
}: ComponentProps<typeof AriaLink> & {
  state: unknown;
  reactRouter: ReactRouter;
}) => {
  const navigate = reactRouter.useNavigate();

  return (
    <AriaLink onPress={() => navigate(href ?? '', { state })} {...props}>
      {children}
    </AriaLink>
  );
};

export default ReactRouterLinkButton;
