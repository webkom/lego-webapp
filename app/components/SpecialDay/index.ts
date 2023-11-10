import { Children, cloneElement, createElement, Component } from 'react';
import config from 'app/config';
import AprilFools from './AprilFools';

type Props = {
  children: any;
};

class SpecialDay extends Component<Props> {
  static getSpecialDay() {
    if (AprilFools.isCorrectDate()) {
      return AprilFools;
    }

    return null;
  }

  render() {
    const { children, ...rest } = this.props;
    const filteredChildren = children.filter(Boolean);
    const specialDay = SpecialDay.getSpecialDay();

    if (config.environment === 'ci' || specialDay === null) {
      return Children.map(filteredChildren, (child) =>
        cloneElement(child, { ...rest }),
      );
    }

    return createElement(specialDay, rest, filteredChildren);
  }
}

export default SpecialDay;
