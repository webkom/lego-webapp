// @flow

import { Component } from 'react';
import type { Group, ID } from 'app/models';
import Select from 'react-select';
import Button from 'app/components/Button';
import Flex from 'app/components/Layout/Flex';

type Props = {
  grades: Array<Group>,
  abakusGroups: Array<Group>,
  changeGrade: (ID, string) => Promise<*>,
  username: string,
};

type Option = {
  value: ID,
  label: string,
};

type State = {
  selectedOption: ?Option,
};

const noLongerStudent = {
  value: null,
  label: 'Ikke student',
};

class GroupChange extends Component<Props, State> {
  constructor() {
    super();
    this.state = {
      selectedOption: null,
    };
  }

  handleOnClick = () =>
    this.state.selectedOption &&
    this.props
      .changeGrade(this.state.selectedOption.value, this.props.username)
      .then(() => this.setState({ selectedOption: null }));

  handleChange = (selectedOption: Option): void => {
    this.setState({ selectedOption });
  };

  render() {
    const { grades, abakusGroups } = this.props;
    const initialGrade = abakusGroups
      .filter(Boolean)
      .find((g) => g.type === 'klasse');

    const initalOption = initialGrade
      ? {
          value: initialGrade.id,
          label: initialGrade.name,
        }
      : noLongerStudent;

    const options = grades.map((g) => ({
      value: g.id,
      label: g.name,
    }));

    return (
      <Flex column gap={10}>
        <Select
          name="form-field-name"
          value={this.state.selectedOption || initalOption}
          onChange={this.handleChange}
          options={[noLongerStudent, ...options]}
          isClearable={false}
        />
        {this.state.selectedOption && (
          <Button onClick={this.handleOnClick} success>
            Lagre endring
          </Button>
        )}
      </Flex>
    );
  }
}

export default GroupChange;
