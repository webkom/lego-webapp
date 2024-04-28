import { Button, Icon } from '@webkom/lego-bricks';
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { hideSurvey, shareSurvey } from 'app/actions/SurveyActions';
import { ContentSidebar } from 'app/components/Content';
import { CheckBox } from 'app/components/Form';
import config from 'app/config';
import { useAppDispatch } from 'app/store/hooks';
import type { EntityId } from '@reduxjs/toolkit';
import type { ActionGrant } from 'app/models';

type GeneratedCSV = {
  url: string;
  filename: string;
};

type Props = {
  surveyId: EntityId;
  actionGrant: ActionGrant;
  token: string | null;
  exportSurvey?: () => Promise<GeneratedCSV>;
};

const AdminSideBar = ({
  surveyId,
  actionGrant,
  token,
  exportSurvey,
}: Props) => {
  const dispatch = useAppDispatch();
  const [copied, setCopied] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();
  const [generatedCSV, setGeneratedCSV] = useState<GeneratedCSV>();
  const canEdit = actionGrant.includes('edit');
  const shareLink = token
    ? `${config.webUrl}/surveys/${surveyId}/results/?token=${token}`
    : '';

  const handleCopyButtonClick = useCallback(() => {
    navigator.clipboard.writeText(shareLink).then(() => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      setCopied(true);

      const newTimeoutId = setTimeout(() => {
        setCopied(false);
      }, 2000);

      setTimeoutId(newTimeoutId);
    });
  }, [shareLink, timeoutId]);

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
                <Button success>
                  <Icon name="download-outline" size={19} />
                  Last ned CSV
                </Button>
              </a>
            ) : (
              <Button
                onPress={async () => setGeneratedCSV(await exportSurvey())}
              >
                <Icon name="download-outline" size={19} />
                Eksporter til CSV
              </Button>
            )}
          </div>
        )}

        {actionGrant && actionGrant.includes('edit') && (
          <CheckBox
            id="shareSurvey"
            label="Del spørreundersøkelsen"
            onChange={() =>
              token
                ? dispatch(hideSurvey(surveyId))
                : dispatch(shareSurvey(surveyId))
            }
            checked={!!token}
          />
        )}

        {token && (
          <Button onPress={handleCopyButtonClick} success={copied}>
            <Icon name={copied ? 'checkmark' : 'copy-outline'} />
            {copied ? 'Kopiert!' : 'Kopier delbar link'}
          </Button>
        )}
      </ContentSidebar>
    )
  );
};

export default AdminSideBar;
