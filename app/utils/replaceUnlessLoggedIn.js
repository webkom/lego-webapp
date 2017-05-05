import React, { Component } from 'react';

export default function replaceUnlessLoggedIn(ReplacementComponent) {
  return ActualComponent => {
    class Replacement extends Component {
      render() {
        if (this.props.loggedIn) {
          return <ActualComponent {...this.props} />;
        }

        return <ReplacementComponent {...this.props} />;
      }
    }

    return Replacement;
  };
}
