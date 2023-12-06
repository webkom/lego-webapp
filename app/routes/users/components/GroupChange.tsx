import { Button, Flex } from '@webkom/lego-bricks';
import { useState } from 'react';
import Select from 'react-select';
import { changeGrade } from 'app/actions/UserActions';
import { selectTheme, selectStyles } from 'app/components/Form/SelectInput';
import { useAppDispatch } from 'app/store/hooks';
import type { Group, ID } from 'app/models';

type Props = {
  grades: Array<Group>;
  abakusGroups: Array<Group>;
  username: string;
};
type Option = {
  value: ID;
  label: string;
};
const noLongerStudent = {
  value: null,
  label: 'Ikke student',
};

const GroupChange = (props: Props) => {
  const [selectedOption, setSelectedOption] = useState<
    Option | null | undefined
  >(null);

  const dispatch = useAppDispatch();

  const handleOnClick = () =>
    selectedOption &&
    dispatch(changeGrade(selectedOption.value, props.username)).then(() => {
      setSelectedOption(null);
    });

  const handleChange = (selectedOption: Option): void => {
    setSelectedOption(selectedOption);
  };

  const { grades, abakusGroups } = props;
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
        value={selectedOption || initalOption}
        onChange={handleChange}
        options={[noLongerStudent, ...options]}
        isClearable={false}
        theme={selectTheme}
        styles={selectStyles}
        instanceId="profile-group"
      />
      {selectedOption && (
        <Button secondary onClick={handleOnClick}>
          Lagre endring
        </Button>
      )}
    </Flex>
  );
};

export default GroupChange;
