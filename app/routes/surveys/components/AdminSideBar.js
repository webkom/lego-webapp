// @flow

import { Component } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import Button from 'app/components/Button';
import { ContentSidebar } from 'app/components/Content';
import { CheckBox } from 'app/components/Form';
import Icon from 'app/components/Icon';
import config from 'app/config';
import type { ActionGrant } from 'app/models';

import styles from './surveys.css';

type Props = {
  surveyId: number,
  actionGrant: ActionGrant,
  token?: string,
  shareSurvey: (number) => Promise<*>,
  hideSurvey: (number) => Promise<*>,
  exportSurvey?: (number) => Promise<*>,
};

type State = {
  copied: boolean,
  generatedCSV: ?{ url: string, filename: string },
};

class AdminSideBar extends Component<Props, State> {
  state = {
    copied: false,
    generatedCSV: undefined,
  };

  render() {
    const {
      surveyId,
      actionGrant = [],
      token,
      shareSurvey,
      hideSurvey,
      exportSurvey,
    } = this.props;

    const { generatedCSV } = this.state;

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
                Del spørreundersøkelsen
              </div>
            )}
            {token && (
              <li>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(shareLink).then(() => {
                      this.setState({ copied: true });
                      setTimeout(() => this.setState({ copied: false }), 2000);
                    });
                  }}
                  className={cx(this.state.copied && styles.copied)}
                >
                  <Icon
                    name={this.state.copied ? 'checkmark' : 'copy'}
                    prefix="ion-md-"
                  />
                  {this.state.copied ? 'Kopiert!' : 'Kopier delbar link'}
                </Button>
              </li>
            )}
            {actionGrant && actionGrant.includes('csv') && exportSurvey && (
              <div style={{ marginTop: '5px' }}>
                {generatedCSV ? (
                  <a href={generatedCSV.url} download={generatedCSV.filename}>
                    Last ned
                  </a>
                ) : (
                  <Button
                    onClick={async () =>
                      this.setState({
                        generatedCSV: await exportSurvey(surveyId),
                      })
                    }
                  >
                    Eksporter til CSV
                  </Button>
                )}
              </div>
            )}
          </ul>
        </ContentSidebar>
      )
    );
  }
}

export default AdminSideBar;
