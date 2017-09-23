import React, { Component } from 'react';
import styles from './optionsBox.css';
import { Link } from 'react-router';
import { CheckBox, RadioButton } from 'app/components/Form';
import Button from 'app/components/Button';
import { SelectInput } from 'app/components/Form';

type Props = {
  companies: Array<Object>,
  display: boolean,
  updateFilters: () => void,
  filters: Object
};

export default class OptionsBox extends Component {
  state = {
    active: false,
    studentContact: false,
    values: {
      active: true
    }
  };

  props: Props;

  toggleDisplay = display => ({ display: display ? 'block' : 'none' });

  toggleSection = section => {
    const { filters, updateFilters } = this.props;
    if (filters[section] === undefined) {
      updateFilters(section, this.state.values[section]);
    } else {
      updateFilters(section, undefined);
    }
    const state = this.state;
    state[section] = !this.state[section];
    this.setState(state);
  };

  updateFilters = (name, value) => {
    const { values } = this.state;
    const { updateFilters } = this.props;
    this.setState(state => ({
      ...state,
      values: { ...values, [name]: value }
    }));
    updateFilters(name, value);
  };

  render() {
    const { display } = this.props;

    return (
      <div className={styles.optionsBox} style={this.toggleDisplay(display)}>
        <Button style={{ marginBottom: '15px' }}>
          <Link to="/bdb/add" style={{ display: 'block' }}>
            Legg til bedrift
          </Link>
        </Button>
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
                  checked={false}
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
                placeholder={'Studentkontakt'}
                name={'studentContact'}
                filter={['users.user']}
                onChange={user =>
                  this.updateFilters(
                    'studentContact',
                    user
                      ? {
                          id: Number(user.value),
                          fullName: user.label,
                          fullInfo: user
                        }
                      : undefined
                  )}
                onBlur={() => null}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
