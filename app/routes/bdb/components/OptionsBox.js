import React, { Component } from 'react';
import styles from './optionsBox.css';
import { Link } from 'react-router';

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
  }

  props: Props;

  toggleDisplay = (display) => ({ display: display ? 'block' : 'none' });

  toggleSection = (section) => {
    const { filters, updateFilters } = this.props;
    if (filters[section] === undefined) {
      updateFilters(section, this.state.values[section]);
    } else {
      updateFilters(section, undefined);
    }
    const state = this.state;
    state[section] = !this.state[section];
    this.setState(state);
  }

  updateFilters = (name, value) => {
    const { values } = this.state;
    const { updateFilters } = this.props;
    values[name] = value;
    this.setState({ values });
    updateFilters(name, value);
  }

  render() {
    const { display } = this.props;

    return (
      <div className={styles.optionsBox} style={this.toggleDisplay(display)}>
        <Link to='/bdb/add' style={{ display: 'block' }}>Legg til bedrift</Link>
        <span style={{ display: 'block' }}>Filtrer basert på om bedriften...</span>

        <div style={{ display: 'flex' }}>
          <div className={styles.section} style={{ order: 0 }}>
            <input
              type='checkBox'
              value
              onChange={() => this.toggleSection('active')}
              id='active'
            /><label htmlFor='active'>Er aktiv</label>

            <div
              className={styles.options}
              style={{ display: this.state.active ? 'block' : 'none' }}
            >
              <div className={styles.option}>
                <input
                  type='radio'
                  name='active'
                  value
                  onChange={() => this.updateFilters('active', true)}
                  id='showActive'
                /><label htmlFor='showActive'>Vis bare aktive bedrifter</label>
              </div>

              <div className={styles.option}>
                <input
                  type='radio'
                  name='active'
                  value
                  onChange={() => this.updateFilters('active', false)}
                  id='hideActive'
                /><label htmlFor='hideActive'>Vis bare inaktive bedrifter</label>
              </div>
            </div>
          </div>

          <div className={styles.section} style={{ order: 0 }}>
            <input
              type='checkBox'
              value
              onChange={() => this.toggleSection('bedex')}
              id='bedex'
            /><label htmlFor='bedex'>Har bedex</label>
            <div
              className={styles.options}
              style={{ display: this.state.bedex ? 'block' : 'none' }}
            >
              <div className={styles.option}>
                <input
                  type='radio'
                  name='bedex'
                  value
                  onChange={() => this.updateFilters('bedex', true)}
                  id='showBedex'
                /><label htmlFor='showBedex'>Vis bedrifter med bedex</label>
              </div>

              <div className={styles.option}>
                <input
                  type='radio'
                  name='bedex'
                  value
                  onChange={() => this.updateFilters('bedex', false)}
                  id='hideBedex'
                /><label htmlFor='hideBedex'>Vis bedrifter uten bedex</label>
              </div>
            </div>
          </div>

          <div className={styles.section} style={{ order: 0 }}>
            <input
              type='checkBox'
              value
              onChange={() => this.toggleSection('jobOfferOnly')}
              id='jobOfferOnly'
            /><label htmlFor='jobOfferOnly'>Kun er opprettet for jobbtilbud</label>
            <div
              className={styles.options}
              style={{ display: this.state.jobOfferOnly ? 'block' : 'none' }}
            >

              <div className={styles.option}>
                <input
                  type='radio'
                  name='jobOfferOnly'
                  value
                  onChange={() => this.updateFilters('jobOfferOnly', true)}
                  id='showJobOfferOnly'
                /><label htmlFor='showJobOfferOnly'>
                  Vis kun bedrifter opprettet for jobbtilbud
                </label>
              </div>

              <div className={styles.option}>
                <input
                  type='radio'
                  name='jobOfferOnly'
                  value
                  onChange={() => this.updateFilters('jobOfferOnly', false)}
                  id='hideJobOfferOnly'
                /><label htmlFor='hideJobOfferOnly'>
                  Skjul bedrifter kun opprettet for jobbtilbud
                </label>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
}
