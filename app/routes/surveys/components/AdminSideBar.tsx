import { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from 'app/components/Button';
import { ContentSidebar } from 'app/components/Content';
import { CheckBox } from 'app/components/Form';
import Icon from 'app/components/Icon';
import config from 'app/config';
import type { ActionGrant } from 'app/models';
import type { ID } from 'app/store/models';

type Props = {
  surveyId: ID;
  actionGrant: ActionGrant;
  token?: string;
  shareSurvey: (id: ID) => Promise<void>;
  hideSurvey: (id: ID) => Promise<void>;
  exportSurvey?: (id: ID) => Promise<void>;
};
type State = {
  copied: boolean;
  generatedCSV:
    | {
        url: string;
        filename: string;
      }
    | null
    | undefined;
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
        <ContentSidebar>
          <h3>Admin</h3>

          <Link to="/surveys/add">
            <Button>
              <Icon name="add" size={19} />
              Ny undersøkelse
            </Button>
          </Link>

          <Link to={`/surveys/${surveyId}/edit`}>
            <Button>
              <Icon name="create-outline" size={19} />
              Rediger
            </Button>
          </Link>

          {actionGrant && actionGrant.includes('csv') && exportSurvey && (
            <div>
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

          {actionGrant && actionGrant.includes('edit') && shareSurvey && (
            <CheckBox
              id="shareSurvey"
              label="Del spørreundersøkelsen"
              onChange={() =>
                token ? hideSurvey(surveyId) : shareSurvey(surveyId)
              }
              value={!!token}
            />
          )}

          {token && (
            <Button
              onClick={() => {
                navigator.clipboard.writeText(shareLink).then(() => {
                  this.setState({
                    copied: true,
                  });
                  setTimeout(
                    () =>
                      this.setState({
                        copied: false,
                      }),
                    2000
                  );
                });
              }}
              success={this.state.copied}
            >
              <Icon name={this.state.copied ? 'checkmark' : 'copy-outline'} />
              {this.state.copied ? 'Kopiert!' : 'Kopier delbar link'}
            </Button>
          )}
        </ContentSidebar>
      )
    );
  }
}

export default AdminSideBar;
