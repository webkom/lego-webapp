// @flow

import React, { Component } from 'react';
import styles from './optionsBox.css';
import { CheckBox, RadioButton } from 'app/components/Form';
import { SelectInput } from 'app/components/Form';
import type { CompanyEntity } from 'app/reducers/companies';

type Props = {
  companies: Array<CompanyEntity>,
  updateFilters: (string, mixed) => void,
  removeFilters: string => void,
  filters: Object
};

type State = {
  active: boolean,
  studentContact: boolean,
  values: {
    active: boolean,
    studentContact: /*TODO: StudentContact */ any
  }
};

export default class OptionsBox extends Component<Props, State> {
  state = {
    active: false,
    studentContact: false,
    values: {
      active: true,
      studentContact: {}
    }
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

  updateFilters = (name: string, value: mixed) => {
    const { updateFilters } = this.props;
    this.setState(state => ({
      ...state,
      values: { ...state.values, [name]: value }
    }));
    updateFilters(name, value);
  };

  removeFilters = (name: string) => {
    const { removeFilters } = this.props;
    this.setState(state => ({
      ...state,
      values: { ...state.values, [name]: undefined }
    }));
    removeFilters(name);
  };

  render() {
    return (
      <div className={styles.optionsBox}>
        <span
          style={{ display: 'block', fontSize: '18px', marginBottom: '5px' }}
        >
          Filtrer basert på om bedriften...
        </span>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className={styles.section} style={{ order: 0 }}>
            <label>
              <CheckBox
                value={this.state.active}
                name="active"
                onChange={() => this.toggleSection('active')}
              />
              <span style={{ marginLeft: '5px' }}>Er aktiv</span>
            </label>

            <div
              className={styles.options}
              style={{ display: this.state.active ? 'block' : 'none' }}
            >
              <label>
                <RadioButton
                  name="active"
                  id="active"
                  inputValue={true}
                  value={this.state.values.active}
                  onChange={() => this.updateFilters('active', true)}
                />
                <span style={{ marginLeft: '5px' }}>
                  Vis bare aktive bedrifter
                </span>
              </label>
              <label>
                <RadioButton
                  name="active"
                  id="inactive"
                  inputValue={false}
                  value={this.state.values.active}
                  onChange={() => this.updateFilters('active', false)}
                />
                <span style={{ marginLeft: '5px' }}>
                  Vis bare inaktive bedrifter
                </span>
              </label>
            </div>

            <label>
              <CheckBox
                value={this.state.studentContact}
                name="studentContact"
                onChange={() => this.toggleSection('studentContact')}
              />
              <span style={{ marginLeft: '5px' }}>Har studentkontakt...</span>
            </label>

            <div
              className={styles.options}
              style={{ display: this.state.studentContact ? 'block' : 'none' }}
            >
              <SelectInput.withAutocomplete
                value={{
                  id:
                    this.state.values.studentContact &&
                    Number(this.state.values.studentContact.value),
                  label:
                    this.state.values.studentContact &&
                    this.state.values.studentContact.fullName
                }}
                placeholder="Studentkontakt"
                name="studentContact"
                filter={['users.user']}
                onChange={user =>
                  user
                    ? this.updateFilters('studentContact', {
                        id: Number(user.value),
                        fullName: user.label
                      })
                    : this.removeFilters('studentContact')}
                onBlur={() => null}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
