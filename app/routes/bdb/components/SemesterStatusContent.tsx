import { Icon } from '@webkom/lego-bricks';
import { useState } from 'react';
import Circle from 'app/components/Circle';
import Dropdown from 'app/components/Dropdown';
import {
  NonEventContactStatus,
  type CompanySemesterContactStatus,
} from 'app/store/models/Company';
import {
  sortStatusesByProminence,
  getStatusColor,
  getStatusDisplayName,
  contactStatuses,
} from '../utils';
import type { CSSProperties } from 'react';

type Props = {
  contactedStatus: CompanySemesterContactStatus[];
  editFunction: (contactStatus: CompanySemesterContactStatus) => void;
  style?: CSSProperties;
};

const SemesterStatusContent = ({
  contactedStatus,
  editFunction,
  style,
}: Props) => {
  const [displayDropdown, setDisplayDropdown] = useState(false);

  const statusesToRender = (
    <div
      style={{
        ...style,
      }}
    >
      {contactedStatus.length > 0
        ? sortStatusesByProminence(contactedStatus)
            .slice()
            .map((status) => getStatusDisplayName(status))
            .join(', ')
        : getStatusDisplayName()}
    </div>
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
                    <Icon name="checkmark" />
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
