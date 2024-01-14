import { Icon } from '@webkom/lego-bricks';
import { Component } from 'react';
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
  semesterStatus: { contactedStatus: CompanySemesterContactStatus[] };
  editFunction: (
    arg0: CompanySemesterContactStatus
  ) => Promise<any> | null | undefined | void;
  style?: CSSProperties;
};

type State = {
  displayDropdown: boolean;
};
export default class SemesterStatusContent extends Component<Props, State> {
  state = {
    displayDropdown: false,
  };

  render() {
    const { semesterStatus, editFunction, style } = this.props;

    const statusesToRender = (
      <div
        style={{
          width: '100%',
          ...style,
        }}
      >
        {semesterStatus.contactedStatus.length > 0
          ? sortStatusesByProminence(semesterStatus.contactedStatus)
              .slice()
              .map((status) => getStatusDisplayName(status))
              .join(', ')
          : getStatusDisplayName()}
      </div>
    );

    return (
      <Dropdown
        show={this.state.displayDropdown}
        toggle={() =>
          this.setState((state) => ({
            displayDropdown: !state.displayDropdown,
          }))
        }
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
              const active =
                semesterStatus.contactedStatus.indexOf(status) !== -1;

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
  }
}
