// @flow

import React, { Component } from 'react';
import styles from './optionsBox.css';
import { CheckBox } from 'app/components/Form';
import { SelectInput } from 'app/components/Form';
import type { SurveyEntity } from 'app/reducers/surveys';

type Props = {
  surveys: Array<SurveyEntity>,
  updateFilters: (string, mixed) => void,
  removeFilters: string => void,
  filters: Object
};

type State = {
  event: boolean,
  values: {
    event: /*TODO: event */ any
  }
};

export default class OptionsBox extends Component<Props, State> {
  state = {
    event: false,
    values: {
      event: {}
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
          Filtrer basert på om undersøkelsen...
        </span>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className={styles.section} style={{ order: 0 }}>
            <label>
              <CheckBox
                value={this.state.event}
                name="event"
                onChange={() => this.toggleSection('event')}
              />
              <span style={{ marginLeft: '5px' }}>Er for arrangement...</span>
            </label>

            <div
              className={styles.options}
              style={{ display: this.state.event ? 'block' : 'none' }}
            >
              <SelectInput.withAutocomplete
                value={{
                  id:
                    this.state.values.event &&
                    Number(this.state.values.event.id),
                  label:
                    this.state.values.event && this.state.values.event.fullName
                }}
                placeholder="Studentkontakt"
                name="event"
                filter={['events.event']}
                onChange={event =>
                  event
                    ? this.updateFilters('event', {
                        id: Number(event.id),
                        title: event.title
                      })
                    : this.removeFilters('event')}
                onBlur={() => null}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
