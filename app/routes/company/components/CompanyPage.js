import React, { Component } from 'react';
import styles from './company.css';

type Props = {
  company: Object
};

export default class CompanyPage extends Component {
  props: Props;


  render() {
    const { company } = this.props;
    if (!company) {
      return (
        <div>
        'laster'
        </div>
      );
    }
    return (
      <div className={styles.root}>
      <h1>{this.props.company.name}</h1>
      </div>
    );
  }
}
