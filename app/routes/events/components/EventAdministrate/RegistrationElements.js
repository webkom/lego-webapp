import styles from './Administrate.css';
import React, { Component } from 'react';
import { Link } from 'react-router';
import { FlexRow, FlexItem } from 'app/components/FlexBox';
import Tooltip from 'app/components/Tooltip';
import Time from 'app/components/Time';
import cx from 'classnames';

export class RegisteredElement extends Component {
  state = {
    unregister: 0
  };

  checkUnregister = id => {
    if (this.state.unregister === id) {
      this.props.unregister(id);
      this.setState({
        unregister: 0
      });
    } else {
      this.setState({
        unregister: id
      });
    }
  };

  render() {
    const { registration, handlePresence, handlePayment } = this.props;
    const transparency = (variable, value) =>
      variable === value ? { opacity: 1 } : { opacity: 0.30 };

    return (
      <li className={styles.element}>
        <div className={styles.col}>
          <Link to={`/users/${registration.user.username}`}>
            {registration.user.username}
          </Link>
        </div>
        <div className={styles.col}>
          <Tooltip
            className={styles.cell}
            content={registration.pool ? 'Påmeldt' : 'Venteliste'}
          >
            {registration.pool
              ? <i
                  className={cx('fa fa-check-circle', styles.faSize)}
                  style={{ color: 'green' }}
                />
              : <i
                  className={cx('fa fa-clock-o fa-2x', styles.faSize)}
                  style={{ color: 'green' }}
                />}
          </Tooltip>
        </div>
        <div className={styles.col}>
          <FlexRow className={styles.presenceIcons}>
            <Tooltip className={styles.cell} content="Til stede">
              <a onClick={() => handlePresence(registration.id, 1)}>
                <i
                  className={cx('fa fa-check', styles.faSize)}
                  style={{
                    color: 'green',
                    ...transparency(registration.presence, 1)
                  }}
                />
              </a>
            </Tooltip>
            <Tooltip className={styles.cell} content="Ukjent">
              <a onClick={() => handlePresence(registration.id, 0)}>
                <i
                  className={cx('fa fa-question-circle', styles.faSize)}
                  style={{
                    color: 'blue',
                    ...transparency(registration.presence, 0)
                  }}
                />
              </a>
            </Tooltip>
            <Tooltip className={styles.cell} content="Ikke til stede">
              <a onClick={() => handlePresence(registration.id, 2)}>
                <i
                  className={cx('fa fa-times', styles.faSize)}
                  style={{
                    color: '#C24538',
                    ...transparency(registration.presence, 2)
                  }}
                />
              </a>
            </Tooltip>
          </FlexRow>
        </div>
        <div className={styles.col}>
          <Tooltip
            content={
              <Time
                time={registration.registrationDate}
                format="DD.MM.YYYY HH:mm"
              />
            }
          >
            <Time time={registration.registrationDate} format="DD.MM.YYYY" />
          </Tooltip>
        </div>
        <div className={styles.col}>
          {'5. Data'}
        </div>
        <div className={styles.col}>
          <FlexRow className={styles.presenceIcons}>
            <Tooltip className={styles.cell} content="Betalt stripe">
              <a onClick={() => handlePayment(registration.id, 1)}>
                <i
                  className={cx('fa fa-cc-stripe', styles.faSize)}
                  style={{
                    color: 'green',
                    ...transparency(registration.chargeStatus, 'succeeded')
                  }}
                />
              </a>
            </Tooltip>
            <Tooltip className={styles.cell} content="Betalt cash">
              <a onClick={() => handlePayment(registration.id, 2)}>
                <i
                  className={cx('fa fa-money', styles.faSize)}
                  style={{
                    color: 'green',
                    ...transparency(registration.chargeStatus, 'cash')
                  }}
                />
              </a>
            </Tooltip>
            <Tooltip className={styles.cell} content="Ikke betalt">
              <a onClick={() => handlePayment(registration.id, 2)}>
                <i
                  className={cx('fa fa-times', styles.faSize)}
                  style={{
                    color: '#C24538',
                    ...transparency(
                      !['cash', 'succeeded'].includes(
                        registration.chargeStatus
                      ),
                      true
                    )
                  }}
                />
              </a>
            </Tooltip>
          </FlexRow>
        </div>
        <div className={styles.col2}>
          {'Tilbakemelding kan være lang, Tilbakemelding kan være lang'}
        </div>
        <div className={styles.col}>
          <a onClick={() => this.checkUnregister(registration.id)}>
            <i
              className="fa fa-minus-circle"
              style={{ color: '#C24538', marginRight: '5px' }}
            />
            {this.state.unregister === registration.id
              ? 'Er du sikker?'
              : 'Meld av'}
          </a>
        </div>
      </li>
    );
  }
}

export const UnregisteredElement = ({ registration }) => {
  return (
    <li className={styles.element}>
      <div className={styles.col}>
        <Link to={`/users/${registration.user.username}`}>
          {registration.user.username}
        </Link>
      </div>
      <div className={styles.col}>Avmeldt</div>
      <div className={styles.col}>
        <Tooltip
          content={
            <Time
              time={registration.registrationDate}
              format="DD.MM.YYYY HH:mm"
            />
          }
        >
          <Time time={registration.registrationDate} format="DD.MM.YYYY" />
        </Tooltip>
      </div>
      <div className={styles.col}>
        <Tooltip
          content={
            <Time
              time={registration.unregistrationDate}
              format="DD.MM.YYYY HH:mm"
            />
          }
        >
          <Time time={registration.unregistrationDate} format="DD.MM.YYYY" />
        </Tooltip>
      </div>
      <div className={styles.col}>5. Data</div>
    </li>
  );
};
