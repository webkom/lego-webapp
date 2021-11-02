// @flow

import { Component } from 'react';
import Button from 'app/components/Button';
import Flex from 'app/components/Layout/Flex';
import styles from './RemovePicture.css';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';

type ButtonProps = {
  deleteUser: (string) => Promise<*>,
  username: string,
};

type State = {
  uName: string,
  show: boolean,
};

class DeleteUser extends Component<ButtonProps, State> {
  state = {
    uName: '',
    show: false,
  };
  render() {
    const { deleteUser, username } = this.props;
    let deleteUserButton;

    if (this.state.uName === username) {
      deleteUserButton = (
        <ConfirmModalWithParent
          title="Slett bruker"
          message="Er du sikker på at du vil slette denne brukeren?"
          onConfirm={() => deleteUser(username)}
        >
          <Button dark className={styles.saveButton}>
            Slett bruker
          </Button>
        </ConfirmModalWithParent>
      );
    }

    return (
      <div>
        {this.state.show === false && (
          <Button
            className={styles.saveButton}
            onClick={() => this.setState({ show: true })}
          >
            Gå videre til slett bruker
          </Button>
        )}
        {this.state.show && (
          <>
            <Button
              className={styles.saveButton}
              onClick={() => this.setState({ show: false })}
            >
              Angre
            </Button>
            <h3> Skriv inn brukernavnet ditt: </h3>
            <input
              type="text"
              id="slettBruker"
              placeholder="Brukernavn"
              onChange={(e) => this.setState({ uName: e.target.value })}
            />{' '}
            <br />
            {deleteUserButton}
          </>
        )}
      </div>
    );
  }
}

export default DeleteUser;
