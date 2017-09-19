import React, { Component } from 'react';
import styles from './optionsBox.css';
import { Link } from 'react-router';
import { CheckBox, RadioButton } from 'app/components/Form';

type Props = {
  companies: Array<Object>,
  display: boolean,
  updateFilters: () => void,
  filters: Object
};

export default class OptionsBox extends Component {
  state = {
    active: false,
    bedex: false,
    jobOfferOnly: false,
    values: {}
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
    values[name] = value;
    this.setState({ values });
    updateFilters(name, value);
  };

  render() {
    const { display } = this.props;

    return (
      <div className={styles.optionsBox} style={this.toggleDisplay(display)}>
        <Link to="/bdb/add" style={{ display: 'block' }}>
          Legg til bedrift
        </Link>
        <span style={{ display: 'block' }}>
          Filtrer basert på om bedriften...
        </span>

        <div style={{ display: 'flex' }}>
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
                  inputValue="true"
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
                  inputValue="false"
                  onChange={() => this.updateFilters('active', false)}
                />
                <span style={{ marginLeft: '5px' }}>
                  Vis bare inaktive bedrifter
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
