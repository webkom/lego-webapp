// @flow

import type { ComponentType } from 'react';

import { PureComponent } from 'react';

type LoginProps = { loggedIn: boolean };

// TODO add proper typings to this when starting to deal with TS
export default function replaceUnlessLoggedIn(
  ReplacementComponent: ComponentType<any>
): (ActualComponent: ComponentType<any>) => ComponentType<any> {
  return (ActualComponent) => {
    class Replacement extends PureComponent<any & LoginProps> {
      render() {
        const { loggedIn, ...props } = this.props;

        if (loggedIn) {
          return <ActualComponent loggedIn={loggedIn} {...props} />;
        }

        return <ReplacementComponent loggedIn={loggedIn} {...props} />;
      }
    }

    return Replacement;
  };
}
