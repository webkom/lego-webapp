// @flow

import React, { Component } from 'react';
import Button from 'app/components/Button';
import Flex from 'app/components/Layout/Flex';

import styles from './GroupChange.css';

type Props = {
  removePicture: string => Promise<*>,
  username: string
};

type State = {
  selected: boolean
};

export default class RemovePicture extends Component<Props, State> {
  constructor() {
    super();
    this.state = {
      selected: false
    };
  }

  handleOnClick = () => {
    if (this.state.selected)
      this.props
        .removePicture(this.props.username)
        .then(() => this.setState({ selected: false }));
  };

  handleChange = () => {
    this.setState({ selected: true });
  };

  handleReset = () => {
    this.setState({ selected: false });
  };

  render() {
    return (
      <Flex column={true}>
        {!this.state.selected && (
          <Button
            dark
            className={styles.saveButton}
            onClick={this.handleChange}
          >
            Slett Bilde
          </Button>
        )}

        {this.state.selected && (
          <div>
            <Button className={styles.saveButton} onClick={this.handleReset}>
              Angre
            </Button>
            <Button
              dark
              className={styles.saveButton}
              onClick={this.handleOnClick}
            >
              Lagre endring
            </Button>
          </div>
        )}
      </Flex>
    );
  }
}
