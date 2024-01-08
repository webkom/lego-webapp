import { Button, Flex, Icon } from '@webkom/lego-bricks';
import { Component } from 'react';
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
import styles from './bdb.css';

type Props = {
  semesterStatus: Record<string, any>;
  editFunction: (
    arg0: CompanySemesterContactStatus
  ) => Promise<any> | null | undefined | void;
  style?: Record<string, any>;
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
            .map((status, index) => (
              <Dropdown.ListItem key={status} className={styles.dropDownItem}>
                <Button flat onClick={() => editFunction(status)}>
                  <Flex alignItems="center">
                    {getStatusDisplayName(status)}
                    {semesterStatus.contactedStatus.indexOf(status) !== -1 && (
                      <Icon name="checkmark" success size={25} />
                    )}
                  </Flex>
                  <div
                    className={styles.lazyCircle}
                    style={{
                      backgroundColor: getStatusColor(status),
                    }}
                  />
                </Button>
                {index !== contactStatuses.length - 2 && <Dropdown.Divider />}
              </Dropdown.ListItem>
            ))}
        </Dropdown.List>
      </Dropdown>
    );
  }
}
