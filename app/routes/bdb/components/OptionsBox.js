import React, { Component } from 'react';
import styles from './optionsBox.css';
import LoadingIndicator from 'app/components/LoadingIndicator';

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

  toggleDisplay = (display) => {
    return { display: display ? 'block' : 'none' };
  }

  toggleSection = (section) => {
    if (this.props.filters[section] === undefined) {
      this.props.updateFilters(section, this.state.values[section]);
    } else {
      this.props.updateFilters(section, undefined);
    }
    const state = this.state;
    state[section] = !this.state[section];
    this.setState(state);
  }

  updateFilters = (name, value) => {
    const values = this.state.values;
    values[name] = value;
    this.setState({ values });
    this.props.updateFilters(name, value);
  }

  render() {
    const { companies } = this.props;
    if (companies.length === 0) {
      return <LoadingIndicator loading />;
    }

    return (
      <div className={styles.optionsBox} style={this.toggleDisplay(this.props.display)}>
        Filtrer basert på om bedriften... <br />
        <div style={{ display: 'flex' }}>
          <div className={styles.section} style={{ order: 0 }}>
            <input
              type='checkBox'
              value
              onChange={this.toggleSection.bind(this, 'active')}
            />Er aktiv
            <div
              className={styles.options}
              style={{ display: this.state.active ? 'block' : 'none' }}
            >
              <div className={styles.option}>
                <input
                  type='radio'
                  name='active'
                  value
                  onChange={this.updateFilters.bind(this, 'active', true)}
                />Vis bare aktive bedrifter
              </div>

              <div className={styles.option}>
                <input
                  type='radio'
                  name='active'
                  value
                  onChange={this.updateFilters.bind(this, 'active', false)}
                />Vis bare inaktive bedrifter
              </div>
            </div>
          </div>

          <div className={styles.section} style={{ order: 0 }}>
            <input
              type='checkBox'
              value
              onChange={this.toggleSection.bind(this, 'bedex')}
            />Har bedex
            <div
              className={styles.options}
              style={{ display: this.state.bedex ? 'block' : 'none' }}
            >
              <div className={styles.option}>
                <input
                  type='radio'
                  name='bedex'
                  value
                  onChange={this.updateFilters.bind(this, 'bedex', true)}
                />Vis bedrifter med bedex
              </div>

              <div className={styles.option}>
                <input
                  type='radio'
                  name='bedex'
                  value
                  onChange={this.updateFilters.bind(this, 'bedex', false)}
                />Vis bedrifter uten bedex
              </div>
            </div>
          </div>

          <div className={styles.section} style={{ order: 0 }}>
            <input
              type='checkBox'
              value
              onChange={this.toggleSection.bind(this, 'jobOfferOnly')}
            />Kun er opprettet for jobbtilbud
            <div
              className={styles.options}
              style={{ display: this.state.jobOfferOnly ? 'block' : 'none' }}
            >
              <div className={styles.option}>
                <input
                  type='radio'
                  name='bedex'
                  value
                  onChange={this.updateFilters.bind(this, 'jobOfferOnly', true)}
                />Vis bedrifter kun opprettet for jobbtilbud
              </div>

              <div className={styles.option}>
                <input
                  type='radio'
                  name='bedex'
                  value
                  onChange={this.updateFilters.bind(this, 'jobOfferOnly', false)}
                />Skjul bedrifter kun opprettet for jobbtilbud
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
}
