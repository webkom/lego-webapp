import type { ComponentType } from 'react';

type LoginProps = {
  loggedIn: boolean;
};

export default function replaceUnlessLoggedIn<Props extends LoginProps>(
  ReplacementComponent: ComponentType<Props>,
): (ActualComponent: ComponentType<Props>) => ComponentType<Props> {
  return (ActualComponent) => {
    const ReplaceUnlessLoggedIn = (props: Props) => {
      if (props.loggedIn) {
        return <ActualComponent {...props} />;
      }
      return <ReplacementComponent {...props} />;
    };

    return ReplaceUnlessLoggedIn;
  };
}
