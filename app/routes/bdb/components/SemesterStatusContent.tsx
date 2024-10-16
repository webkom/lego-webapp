import { Icon } from '@webkom/lego-bricks';
import { Check } from 'lucide-react';
import { useState } from 'react';
import Circle from 'app/components/Circle';
import Dropdown from 'app/components/Dropdown';
import Tags from 'app/components/Tags';
import Tag from 'app/components/Tags/Tag';
import {
  NonEventContactStatus,
  type CompanySemesterContactStatus,
} from 'app/store/models/Company';
import {
  sortStatusesByProminence,
  getStatusColor,
  getStatusDisplayName,
  contactStatuses,
  getStatusTextColor,
} from '../utils';
import type { CSSProperties } from 'react';

type Props = {
  contactedStatus: CompanySemesterContactStatus[];
  editFunction: (contactStatus: CompanySemesterContactStatus) => void;
  style?: CSSProperties;
};

const SemesterStatusContent = ({ contactedStatus, editFunction }: Props) => {
  const [displayDropdown, setDisplayDropdown] = useState(false);

  const statusesToRender = (
    <Tags>
      {contactedStatus.length > 0
        ? sortStatusesByProminence(contactedStatus)
            .slice()
            .map((status) => (
              <Tag
                key={status}
                tag={getStatusDisplayName(status)}
                textColor={getStatusTextColor(status)}
                backgroundColor={getStatusColor(status)}
              />
            ))
        : getStatusDisplayName()}
    </Tags>
  );

  return (
    <Dropdown
      show={displayDropdown}
      toggle={() => setDisplayDropdown((prev) => !prev)}
      closeOnContentClick
      style={{
        width: '100%',
        textAlign: 'left',
      }}
      triggerComponent={statusesToRender}
    >
      <Dropdown.List>
        {contactStatuses
          .filter((status) => status !== NonEventContactStatus.NOT_CONTACTED)
          .map((status, index) => {
            const active = contactedStatus.indexOf(status) !== -1;

            return (
              <Dropdown.ListItem key={status}>
                <button
                  onClick={() => editFunction(status)}
                  style={{
                    backgroundColor: active ? getStatusColor(status) : '',
                  }}
                >
                  {getStatusDisplayName(status)}
                  {active ? (
                    <Icon iconNode={<Check />} />
                  ) : (
                    <Circle color={getStatusColor(status)} size={20} />
                  )}
                </button>
                {index !== contactStatuses.length - 2 && <Dropdown.Divider />}
              </Dropdown.ListItem>
            );
          })}
      </Dropdown.List>
    </Dropdown>
  );
};

export default SemesterStatusContent;
