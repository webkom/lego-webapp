// @flow

import * as React from 'react';
import styles from './surveys.css';
import { Link } from 'react-router-dom';
import type { ActionGrant } from 'app/models';
import { ContentSidebar } from 'app/components/Content';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Button from 'app/components/Button';
import config from 'app/config';
import { CheckBox } from 'app/components/Form';

type Props = {
  surveyId: number,
  actionGrant: ActionGrant,
  token?: string,
  shareSurvey: number => Promise<*>,
  hideSurvey: number => Promise<*>
};

type State = {
  copied: boolean
};

export class AdminSideBar extends React.Component<Props, State> {
  state = {
    copied: false
  };

  render() {
    const {
      surveyId,
      actionGrant = [],
      token,
      shareSurvey,
      hideSurvey
    } = this.props;

    const canEdit = actionGrant.includes('edit');

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
            {actionGrant && actionGrant.includes('edit') && shareSurvey && (
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
