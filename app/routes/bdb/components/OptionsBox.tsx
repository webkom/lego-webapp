import { Flex } from '@webkom/lego-bricks';
import { Component } from 'react';
import { CheckBox, RadioButton, SelectInput } from 'app/components/Form';
import styles from './OptionsBox.css';
import type { TransformedAdminCompany } from 'app/reducers/companies';
import type { AutocompleteUser } from 'app/store/models/User';

type Props = {
  companies: TransformedAdminCompany[];
  updateFilters: (arg0: string, arg1: unknown) => void;
  removeFilters: (arg0: string) => void;
  filters: Record<string, any>;
};
type State = {
  active: boolean;
  studentContact: boolean;
  values: {
    active: boolean;
    studentContact: AutocompleteUser | undefined;
  };
};
export default class OptionsBox extends Component<Props, State> {
  state: State = {
    active: false,
    studentContact: false,
    values: {
      active: true,
      studentContact: undefined,
    },
  };
  toggleSection = (section: string) => {
    const { filters, updateFilters, removeFilters } = this.props;

    if (filters[section] === undefined) {
      updateFilters(section, this.state.values[section]);
    } else {
      removeFilters(section);
    }

    const state = this.state;
    state[section] = !this.state[section];
    this.setState(state);
  };
  updateFilters = (name: string, value: unknown) => {
    const { updateFilters } = this.props;
    this.setState((state) => ({
      ...state,
      values: { ...state.values, [name]: value },
    }));
    updateFilters(name, value);
  };
  removeFilters = (name: string) => {
    const { removeFilters } = this.props;
    this.setState((state) => ({
      ...state,
      values: { ...state.values, [name]: undefined },
    }));
    removeFilters(name);
  };

  render() {
    return (
      <div className={styles.optionsBox}>
        <Flex column>
          <h4>Filtrer basert på om bedriften ...</h4>
          <div className={styles.section}>
            <CheckBox
              id="isActive"
              checked={this.state.active}
              name="active"
              label="Er aktiv"
              onChange={() => this.toggleSection('active')}
            />

            <div
              className={styles.options}
              style={{
                display: this.state.active ? 'block' : 'none',
              }}
            >
              <RadioButton
                name="active"
                id="active"
                label="Vis bare aktive bedrifter"
                value={this.state.values.active}
                onChange={() => this.updateFilters('active', true)}
              />
              <RadioButton
                name="active"
                id="inactive"
                label="Vis bare inaktive bedrifter"
                value={this.state.values.active}
                onChange={() => this.updateFilters('active', false)}
              />
            </div>

            <CheckBox
              id="hasStudentContact"
              checked={this.state.studentContact}
              name="studentContact"
              label="Har studentkontakt ..."
              onChange={() => this.toggleSection('studentContact')}
            />

            <div
              className={styles.options}
              style={{
                display: this.state.studentContact ? 'block' : 'none',
              }}
            >
              <SelectInput.WithAutocomplete
                value={{
                  id:
                    this.state.values.studentContact &&
                    Number(this.state.values.studentContact.id),
                  label:
                    this.state.values.studentContact &&
                    this.state.values.studentContact.fullName,
                }}
                placeholder="Studentkontakt"
                name="studentContact"
                filter={['users.user']}
                onChange={(user: AutocompleteUser) => {
                  user
                    ? this.updateFilters('studentContact', {
                        id: Number(user.id),
                        fullName: user.label,
                      })
                    : this.removeFilters('studentContact');
                }}
                onBlur={() => null}
              />
            </div>
          </div>
        </Flex>
      </div>
    );
  }
}
