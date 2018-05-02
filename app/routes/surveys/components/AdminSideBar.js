// @flow

import * as React from 'react';
import styles from './surveys.css';
import { Link } from 'react-router';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';
import type { ActionGrant } from 'app/models';
import { ContentSidebar } from 'app/components/Content';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Button from 'app/components/Button';
import config from 'app/config';
import { CheckBox } from 'app/components/Form';

type Props = {
  surveyId: number,
  deleteFunction?: number => Promise<*>,
  push?: string => void,
  actionGrant: ActionGrant,
  token?: string,
  shareSurvey: number => Promise<*>,
  hideSurvey: number => Promise<*>
};

type State = {
  copied: boolean
};

export class AdminSideBar extends React.Component<Props, State> {
  state: State = {
    copied: false
  };

  render() {
    const {
      surveyId,
      deleteFunction,
      actionGrant = [],
      push,
      token,
      shareSurvey,
      hideSurvey
    } = this.props;

    const canEdit = actionGrant.includes('edit');

    const onConfirm = () => {
      if (deleteFunction && push) {
        return (
          deleteFunction &&
          deleteFunction(surveyId).then(() => push && push('/surveys'))
        );
      }
      if (deleteFunction) {
        return deleteFunction && deleteFunction(surveyId);
      }
      return Promise.resolve();
    };

    const shareLink = !token
      ? ''
      : `${config.webUrl}/surveys/${surveyId}/results/?token=${token}`;

    return (
      canEdit && (
        <ContentSidebar className={styles.adminSideBar}>
          <strong>Admin</strong>
          <ul>
            <li>
              <Link to="/surveys/add">Ny undersøkelse</Link>
            </li>
            <li>
              <Link to={`/surveys/${surveyId}/edit`}>Endre undersøkelsen</Link>
            </li>
            {deleteFunction && (
              <ConfirmModalWithParent
                title="Slett undersøkelse"
                message="Er du sikker på at du vil slette denne undersøkelseen?"
                onConfirm={onConfirm}
              >
                <li>
                  <Link to="">Slett undersøkelsen</Link>
                </li>
              </ConfirmModalWithParent>
            )}
            {actionGrant &&
              actionGrant.includes('edit') &&
              shareSurvey && (
                <div>
                  <CheckBox
                    onChange={() =>
                      token ? hideSurvey(surveyId) : shareSurvey(surveyId)
                    }
                    value={!!token}
                  />
                  Del spørreundersøkelsen{' '}
                </div>
              )}

            {token && (
              <li>
                <CopyToClipboard
                  text={shareLink}
                  onCopy={() => {
                    this.setState({ copied: true });
                    setTimeout(() => this.setState({ copied: false }), 2000);
                  }}
                  style={{ marginTop: '5px' }}
                >
                  <Button>
                    {this.state.copied ? 'Kopiert!' : 'Kopier delbar link'}
                  </Button>
                </CopyToClipboard>
              </li>
            )}
          </ul>
        </ContentSidebar>
      )
    );
  }
}

export default AdminSideBar;
