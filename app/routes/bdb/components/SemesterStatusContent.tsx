import cx from 'classnames';
import { Component } from 'react';
import Button from 'app/components/Button';
import Dropdown from 'app/components/Dropdown';
import Icon from 'app/components/Icon';
import type { CompanySemesterContactedStatus } from 'app/models';
import {
  sortStatusesByProminence,
  getStatusString,
  statusStrings,
  selectColorCode,
} from '../utils';
import styles from './bdb.css';

type Props = {
  semesterStatus: Record<string, any>;
  editFunction: (
    arg0: CompanySemesterContactedStatus
  ) => Promise<any> | null | undefined;
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
              .map((status) => getStatusString(status))
              .join(', ')
          : getStatusString('not_contacted')}
      </div>
    );
    const statusCodes = sortStatusesByProminence(
      Object.keys(statusStrings)
    ).filter((code) => code !== 'not_contacted');
    const dropDownItems = (
      <Dropdown.List>
        {statusCodes.map((statusString, j) => (
          <Dropdown.ListItem key={j} className={styles.dropDownItem}>
            <Button flat onClick={(e) => editFunction(statusString)}>
              <div>
                {semesterStatus.contactedStatus.indexOf(statusString) !== -1 ? (
                  <Icon
                    name="checkmark"
                    style={{
                      color: 'var(--color-green-6)',
                      marginRight: '5px',
                      position: 'relative',
                      top: '5px',
                    }}
                    size={25}
                  />
                ) : (
                  <div
                    style={{
                      width: '10px',
                      height: '1px',
                      display: 'inline-block',
                    }}
                  />
                )}
                {getStatusString(statusString)}
              </div>
              <div
                className={cx(
                  styles[selectColorCode(statusString)],
                  styles.lazyCircle
                )}
              />
            </Button>
            {j !== statusCodes.length - 1 && <Dropdown.Divider />}
          </Dropdown.ListItem>
        ))}
      </Dropdown.List>
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
        {dropDownItems}
      </Dropdown>
    );
  }
}
