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
      variable !== value && styles.transparent;

    return (
      <li className={styles.registeredList}>
        <div className={styles.one}>
          <Link to={`/users/${registration.user.username}`}>
            {registration.user.username}
          </Link>
        </div>
        <div className={styles.center}>
          <Tooltip
            className={styles.cell}
            content={registration.pool ? 'Påmeldt' : 'Venteliste'}
          >
            {registration.pool
              ? <i className={cx('fa fa-check-circle', styles.greenIcon)} />
              : <i className={cx('fa fa-clock-o fa-2x', styles.greenIcon)} />}
          </Tooltip>
        </div>
        <div className={styles.center}>
          <FlexRow className={styles.presenceIcons}>
            <Tooltip className={styles.cell} content="Til stede">
              <a
                className={transparency(registration.presence, 1)}
                onClick={() => handlePresence(registration.id, 1)}
              >
                <i className={cx('fa fa-check', styles.greenIcon)} />
              </a>
            </Tooltip>
            <Tooltip className={styles.cell} content="Ukjent">
              <a
                className={transparency(registration.presence, 0)}
                onClick={() => handlePresence(registration.id, 0)}
              >
                <i
                  className={cx('fa fa-question-circle', styles.questionIcon)}
                />
              </a>
            </Tooltip>
            <Tooltip className={styles.cell} content="Ikke til stede">
              <a
                className={transparency(registration.presence, 2)}
                onClick={() => handlePresence(registration.id, 2)}
              >
                <i className={cx('fa fa-times', styles.crossIcon)} />
              </a>
            </Tooltip>
          </FlexRow>
        </div>
        <div className={styles.one}>
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
        <div className={styles.center}>
          {'5. Data'}
        </div>
        <div className={styles.center}>
          <FlexRow className={styles.presenceIcons}>
            <Tooltip className={styles.cell} content="Betalt stripe">
              <div
                className={transparency(registration.chargeStatus, 'succeeded')}
              >
                <i className={cx('fa fa-cc-stripe', styles.greenIcon)} />
              </div>
            </Tooltip>
            <Tooltip className={styles.cell} content="Betalt manuelt">
              <a
                className={transparency(registration.chargeStatus, 'manual')}
                onClick={() => handlePayment(registration.id, 'manual')}
              >
                <i className={cx('fa fa-money', styles.greenIcon)} />
              </a>
            </Tooltip>
            <Tooltip className={styles.cell} content="Ikke betalt">
              <a
                className={transparency(
                  !['manual', 'succeeded'].includes(registration.chargeStatus),
                  true
                )}
                onClick={() => handlePayment(registration.id, 'failed')}
              >
                <i className={cx('fa fa-times', styles.crossIcon)} />
              </a>
            </Tooltip>
          </FlexRow>
        </div>
        <div className={styles.one}>
          {'Tilbakemelding kan være lang, Tilbakemelding kan være lang'}
        </div>
        <div className={styles.one}>
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
    <li className={styles.unregisteredList}>
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
