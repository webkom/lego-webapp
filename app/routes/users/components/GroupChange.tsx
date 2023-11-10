import { Button, Flex } from '@webkom/lego-bricks';
import { Component } from 'react';
import Select from 'react-select';
import { selectTheme, selectStyles } from 'app/components/Form/SelectInput';
import type { Group, ID } from 'app/models';

type Props = {
  grades: Array<Group>;
  abakusGroups: Array<Group>;
  changeGrade: (arg0: ID, arg1: string) => Promise<any>;
  username: string;
};
type Option = {
  value: ID;
  label: string;
};
type State = {
  selectedOption: Option | null | undefined;
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
      .then(() =>
        this.setState({
          selectedOption: null,
        }),
      );
  handleChange = (selectedOption: Option): void => {
    this.setState({
      selectedOption,
    });
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
          theme={selectTheme}
          styles={selectStyles}
          instanceId="profile-group"
        />
        {this.state.selectedOption && (
          <Button secondary onClick={this.handleOnClick}>
            Lagre endring
          </Button>
        )}
      </Flex>
    );
  }
}

export default GroupChange;
