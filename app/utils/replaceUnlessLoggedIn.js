// @flow

import React, { PureComponent, type ComponentType } from 'react';

type LoginProps = { loggedIn: boolean };

export default function replaceUnlessLoggedIn<Props: Object>(
  ReplacementComponent: ComponentType<Props>
): (ActualComponent: ComponentType<Props>) => ComponentType<Props> {
  return ActualComponent => {
    class Replacement extends PureComponent<Props & LoginProps> {
      render() {
        const { loggedIn, ...props } = this.props;

        if (loggedIn) {
          return <ActualComponent {...props} />;
        }

        return <ReplacementComponent {...props} />;
      }
    }

    return Replacement;
  };
}
