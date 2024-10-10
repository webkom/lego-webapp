import { Button } from '@webkom/lego-bricks';
import { useState } from 'react';
import { changeGrade } from 'app/actions/UserActions';
import SelectInput from 'app/components/Form/SelectInput';
import { ProfileSection } from 'app/routes/users/components/UserProfile/ProfileSection';
import { useAppDispatch } from 'app/store/hooks';
import type { EntityId } from '@reduxjs/toolkit';
import type { PublicGroup } from 'app/store/models/Group';

type Props = {
  grades: PublicGroup[];
  abakusGroups: EntityId[];
  username: string;
};
type Option = {
  value: EntityId | null;
  label: string;
};
const noLongerStudent = {
  value: null,
  label: 'Ikke student',
};

const GroupChange = ({ grades, abakusGroups, username }: Props) => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const dispatch = useAppDispatch();

  const handleOnClick = () =>
    selectedOption &&
    dispatch(changeGrade(selectedOption.value, username)).then(() => {
      setSelectedOption(null);
    });

  const handleChange = (selectedOption: Option): void => {
    setSelectedOption(selectedOption);
  };

  const initialGrade = grades.find((g) => abakusGroups.includes(g.id));
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
    <ProfileSection title="Endre klasse">
      <SelectInput
        name="form-field-name"
        value={selectedOption || initalOption}
        onChange={handleChange}
        options={[noLongerStudent, ...options]}
        isClearable={false}
      />
      {selectedOption && (
        <Button secondary onPress={handleOnClick}>
          Lagre endring
        </Button>
      )}
    </ProfileSection>
  );
};

export default GroupChange;
