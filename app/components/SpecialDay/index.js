// @flow
import React from 'react';
import config from 'app/config';
import AprilFools from './AprilFools';

type Props = {
  children: any
};

type State = {
  specialDay: any
};

class SpecialDay extends React.Component<Props, State> {
  state = {
    specialDay: SpecialDay.getSpecialDay()
  };

  static getSpecialDay() {
    if (AprilFools.isCorrectDate()) {
      return AprilFools;
    }
    return null;
  }

  render() {
    const { children, ...rest } = this.props;
    const { specialDay } = this.state;

    if (config.environment === 'ci' || specialDay === null) {
      return React.Children.map(children, child =>
        React.cloneElement(child, { ...rest })
      );
    }

    return React.createElement(specialDay, rest, children);
  }
}

export default SpecialDay;
