import { Flex } from '@webkom/lego-bricks';
import { useState } from 'react';
import { CheckBox, RadioButton, SelectInput } from 'app/components/Form';
import { AutocompleteContentType } from 'app/store/models/Autocomplete';
import styles from './OptionsBox.css';
import type { TransformedAdminCompany } from 'app/reducers/companies';
import type { AutocompleteUser } from 'app/store/models/User';

type Props = {
  companies: TransformedAdminCompany[];
  updateFilters: (name: string, value: unknown) => void;
  removeFilters: (name: string) => void;
};
const OptionsBox = ({ updateFilters, removeFilters }: Props) => {
  const [active, setActive] = useState<boolean>(false);
  const [activeValue, setActiveValue] = useState<boolean>(false);
  const [studentContact, setStudentContact] = useState<boolean>(false);
  const [studentContactValue, setStudentContactValue] = useState<
    AutocompleteUser | undefined
  >();

  const toggleActive = () => {
    if (active) {
      removeFilters('active');
    } else {
      updateFilters('active', activeValue);
    }
    setActive(!active);
  };

  const toggleStudentContact = () => {
    if (studentContact) {
      removeFilters('studentContact');
    } else if (studentContactValue) {
      updateFilters('studentContact', studentContactValue.id);
    }
    setStudentContact(!studentContact);
  };

  return (
    <div className={styles.optionsBox}>
      <Flex column>
        <h4>Filtrer basert på om bedriften ...</h4>
        <div className={styles.section}>
          <CheckBox
            id="isActive"
            checked={active}
            name="active"
            label="Er aktiv"
            onChange={() => toggleActive()}
          />

          <div
            className={styles.options}
            style={{
              display: active ? 'block' : 'none',
            }}
          >
            <RadioButton
              name="active"
              id="active"
              label="Vis bare aktive bedrifter"
              onChange={() => {
                updateFilters('active', true);
                setActiveValue(true);
              }}
            />
            <RadioButton
              name="active"
              id="inactive"
              label="Vis bare inaktive bedrifter"
              onChange={() => {
                updateFilters('active', false);
                setActiveValue(false);
              }}
            />
          </div>

          <CheckBox
            id="hasStudentContact"
            checked={studentContact}
            name="studentContact"
            label="Har studentkontakt ..."
            onChange={() => toggleStudentContact()}
          />

          <div
            className={styles.options}
            style={{
              display: studentContact ? 'block' : 'none',
            }}
          >
            <SelectInput.WithAutocomplete
              value={{
                id: studentContactValue && studentContactValue.id,
                label: studentContactValue && studentContactValue.label,
              }}
              placeholder="Studentkontakt"
              name="studentContact"
              filter={[AutocompleteContentType.User]}
              onChange={(user: AutocompleteUser) => {
                if (user) {
                  updateFilters('studentContact', user.id);
                  setStudentContactValue(user);
                } else removeFilters('studentContact');
              }}
              onBlur={() => null}
            />
          </div>
        </div>
      </Flex>
    </div>
  );
};

export default OptionsBox;
