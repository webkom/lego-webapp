import type { ComponentType } from 'react';

type LoginProps = {
  loggedIn: boolean;
}; // TODO add proper typings to this when starting to deal with TS

export default function replaceUnlessLoggedIn(
  ReplacementComponent: ComponentType<any>
): (ActualComponent: ComponentType<any>) => ComponentType<any> {
  return (ActualComponent) => {
    const Replacement = ({ loggedIn, ...props }: LoginProps) => {
      if (loggedIn) {
        return <ActualComponent loggedIn={loggedIn} {...props} />;
      }

      return <ReplacementComponent loggedIn={loggedIn} {...props} />;
    };

    return Replacement;
  };
}
