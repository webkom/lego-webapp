// @flow

import React, { Component } from 'react';
import Button from 'app/components/Button';
import Flex from 'app/components/Layout/Flex';
import styles from './RemovePicture.css';

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

  toggleSelected = () => this.setState({ selected: !this.state.selected });

  render() {
    return (
      <Flex justifyContent="center">
        <Button className={styles.saveButton} onClick={this.toggleSelected}>
          {this.state.selected ? 'Angre' : 'Slett Bilde'}
        </Button>
        {this.state.selected && (
          <Button
            dark
            className={styles.saveButton}
            onClick={this.handleOnClick}
          >
            Lagre endring
          </Button>
        )}
      </Flex>
    );
  }
}
