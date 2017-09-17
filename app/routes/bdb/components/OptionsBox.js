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

          <div className={styles.section} style={{ order: 0 }}>
            <label>
              <CheckBox
                id="bedex"
                value={this.state.bedex}
                onChange={() => this.toggleSection('bedex')}
              />
              <span style={{ marginLeft: '5px' }}>Har bedex</span>
            </label>
            <div
              className={styles.options}
              style={{ display: this.state.bedex ? 'block' : 'none' }}
            >
              <label>
                <RadioButton
                  name="bedex"
                  id="showBedex"
                  inputValue="true"
                  onChange={() => this.updateFilters('bedex', true)}
                />
                <span style={{ marginLeft: '5px' }}>
                  Vis bedrifter med bedex
                </span>
              </label>
              <label>
                <RadioButton
                  name="bedex"
                  id="hideBedex"
                  inputValue="false"
                  onChange={() => this.updateFilters('bedex', false)}
                />
                <span style={{ marginLeft: '5px' }}>
                  Vis bedrifter uten bedex
                </span>
              </label>
            </div>
          </div>

          <div className={styles.section} style={{ order: 0 }}>
            <label>
              <CheckBox
                id="jobOfferOnly"
                value={this.state.jobOfferOnly}
                onChange={() => this.toggleSection('jobOfferOnly')}
              />
              <span style={{ marginLeft: '5px' }}>
                Kun er opprettet for jobbtilbud
              </span>
            </label>
            <div
              className={styles.options}
              style={{ display: this.state.jobOfferOnly ? 'block' : 'none' }}
            >
              <label>
                <RadioButton
                  name="jobOfferOnly"
                  id="showJobOfferOnly"
                  inputValue="true"
                  onChange={() => this.updateFilters('jobOfferOnly', true)}
                />
                <span style={{ marginLeft: '5px' }}>
                  Vis kun bedrifter opprettet for jobbtilbud
                </span>
              </label>
              <label>
                <RadioButton
                  name="jobOfferOnly"
                  id="hideJobOfferOnly"
                  inputValue="false"
                  onChange={() => this.updateFilters('jobOfferOnly', false)}
                />
                <span style={{ marginLeft: '5px' }}>
                  Skjul bedrifter kun opprettet for jobbtilbud
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
