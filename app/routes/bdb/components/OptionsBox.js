import React, { Component } from 'react';
import styles from './bdb.css';
import LoadingIndicator from 'app/components/LoadingIndicator';

type Props = {
  companies: Array<Object>,
  display: boolean,
  updateFilters: () => void,
};

export default class OptionsBox extends Component {

  props: Props;

  toggleDisplay = (display) => {
    return { display: display ? 'block' : 'none' };
  }

  render() {
    const { companies, updateFilters } = this.props;
    if (companies.length === 0) {
      return <LoadingIndicator loading />;
    }

    return (
      <div className={styles.optionsBox} style={this.toggleDisplay(this.props.display)}>
        <input
          type='radio'
          name='active'
          value
          onChange={updateFilters.bind(this, { active: true })}
        />Vis bare aktive bedrifter
        <br />

        <input
          type='radio'
          name='active'
          value
          onChange={updateFilters.bind(this, { active: false })}
        />Vis bare inaktive bedrifter
        <br />
      </div>
    );
  }
}
