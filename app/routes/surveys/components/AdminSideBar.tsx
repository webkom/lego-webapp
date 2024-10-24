import { Button, ButtonGroup, Icon, LinkButton } from '@webkom/lego-bricks';
import { Check, Copy, FileDown, FileUp, Pencil, Plus } from 'lucide-react';
import { useCallback, useState } from 'react';
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
        <div>
          <h3>Admin</h3>

          <ButtonGroup vertical>
            <LinkButton href="/surveys/add">
              <Icon iconNode={<Plus />} size={19} />
              Ny undersøkelse
            </LinkButton>

            <LinkButton href={`/surveys/${surveyId}/edit`}>
              <Icon iconNode={<Pencil />} size={19} />
              Rediger
            </LinkButton>

            {actionGrant &&
              actionGrant.includes('csv') &&
              exportSurvey &&
              (generatedCSV ? (
                <LinkButton
                  success
                  href={generatedCSV.url}
                  download={generatedCSV.filename}
                >
                  <Icon iconNode={<FileDown />} size={19} />
                  Last ned CSV
                </LinkButton>
              ) : (
                <Button
                  onPress={async () => setGeneratedCSV(await exportSurvey())}
                >
                  <Icon iconNode={<FileUp />} size={19} />
                  Eksporter til CSV
                </Button>
              ))}

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
                <Icon iconNode={copied ? <Check /> : <Copy />} size={19} />
                {copied ? 'Kopiert!' : 'Kopier delbar link'}
              </Button>
            )}
          </ButtonGroup>
        </div>
      </ContentSidebar>
    )
  );
};

export default AdminSideBar;
