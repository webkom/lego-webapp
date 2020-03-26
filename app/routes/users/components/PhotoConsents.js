// @flow

import React, { Component } from 'react';
import Select from 'react-select';
import Button from 'app/components/Button';
import Flex from 'app/components/Layout/Flex';
import cx from 'classnames';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';
import type { PhotoConsent, PhotoConsentDomain } from 'app/models';
import moment from 'moment-timezone';

import styles from './PhotoConsent.css';

type Props = {
  photoConsents: Array<PhotoConsent>,
  username: string,
  updatePhotoConsent: (
    PhotoConsent: PhotoConsent,
    username: string
  ) => Promise<*>,
};

type Option = {
  value: string,
  label: string,
};

type State = {
  selectedOption: ?Option,
};

class PhotoConsents extends Component<Props, State> {
  constructor() {
    super();
    this.state = {
      selectedOption: null,
    };
  }

  handleChange = (selectedOption: Option): void => {
    this.setState({ selectedOption });
  };

  render() {
    const { photoConsents, username, updatePhotoConsent } = this.props;
    const { selectedOption } = this.state;

    const getYear = (semesterStr: string): number =>
      parseInt(semesterStr.substr(1, 2));

    const getSemester = (semesterStr: string): string => semesterStr.charAt(0);

    const convertToReadableSemester = (semesterYear: string): string => {
      let result = '';
      if (getSemester(semesterYear) == 'H') {
        result = result + 'høsten ';
      } else {
        result = result + 'våren ';
      }

      result = result + getYear(semesterYear);
      return result;
    };

    const getSemesterList = (): Array<string> =>
      [...new Set(photoConsents.map((c) => c.semester))].sort((a, b) =>
        getYear(b) == getYear(a)
          ? parseInt(getSemester(b)) - parseInt(getSemester(a))
          : getYear(b) - getYear(a)
      );

    const createInitialOption = (): Option => {
      const mostRecentSemester = getSemesterList()[0];
      const initialOption = {
        value: mostRecentSemester,
        label: mostRecentSemester,
      };
      this.setState({
        selectedOption: initialOption,
      });
      return initialOption;
    };

    const createOptions = (): Array<Option> =>
      getSemesterList().map((semester) => ({
        value: semester,
        label: semester,
      }));

    const getSelectedSemester = (): string =>
      (selectedOption && selectedOption.value) || '';

    const getSelectedConsent = (domain: PhotoConsentDomain): ?PhotoConsent =>
      photoConsents.find(
        (pc: PhotoConsent): boolean =>
          pc.semester === getSelectedSemester() && pc.domain === domain
      );

    const isConsentingDomain = (domain: PhotoConsentDomain): ?boolean => {
      const consent = getSelectedConsent(domain);
      return consent && consent.isConsenting;
    };

    const getConsentUpdatedAt = (domain: PhotoConsentDomain): string => {
      const consent = getSelectedConsent(domain);
      return (
        (consent &&
          consent.updatedAt &&
          moment(consent.updatedAt).format('DD. MMM YYYY')) ||
        'aldri'
      );
    };

    const getButtonClass = (isConsentBtn, domain) => {
      const consenting = isConsentingDomain(domain);
      if (domain == 'SOCIAL_MEDIA') {
        if (isConsentBtn) {
          if (consenting === null) return styles.consentBtn;

          return cx(styles.consentBtn, consenting ? styles.selectedBtn : '');
        }

        if (consenting === null) return styles.notConsentBtn;

        return cx(styles.notConsentBtn, !consenting ? styles.selectedBtn : '');
      }

      if (isConsentBtn) {
        if (consenting === null) return styles.consentBtn;

        return cx(styles.consentBtn, consenting ? styles.selectedBtn : '');
      }

      if (consenting === null) return styles.notConsentBtn;

      return cx(styles.notConsentBtn, !consenting ? styles.selectedBtn : '');
    };

    return (
      <Flex column={true}>
        <label htmlFor="select-semester">
          <h3>Semester</h3>
        </label>
        <Select
          name="select-semester"
          clearable={false}
          options={createOptions()}
          value={selectedOption || createInitialOption()}
          onChange={this.handleChange}
        />
        <h4 className={styles.categoryTitle}>Sosiale medier</h4>
        <h5>
          Jeg godtar at Abakus kan legge ut bilder av meg på sosiale medier i
          perioden {convertToReadableSemester(getSelectedSemester())}:
        </h5>
        <div className={styles.statusContainer}>
          <b>Sist oppdatert: </b>
          <i>{getConsentUpdatedAt('SOCIAL_MEDIA')}</i>
        </div>
        <div>
          <ConfirmModalWithParent
            closeOnConfirm={true}
            title="Trekke bildesamtykke på sosiale medier"
            message={
              'Er du sikker på at du vil trekke bildesamtykket ditt for ' +
              convertToReadableSemester(getSelectedSemester()) +
              ' på sosiale medier? Dette innebærer at noen må manuelt gå gjennom alle bildene fra arrangementene du har deltatt på i perioden ' +
              convertToReadableSemester(getSelectedSemester()) +
              ', og fjerne dem. Dersom du ønsker å fjerne noen spesifike bilder, kan du i stedet sende en epost til pr@abakus.no.'
            }
            onConfirm={() =>
              updatePhotoConsent(
                {
                  semester: getSelectedSemester(),
                  domain: 'SOCIAL_MEDIA',
                  isConsenting: false,
                  updatedAt: undefined,
                },
                username
              )
            }
          >
            <Button className={getButtonClass(false, 'SOCIAL_MEDIA')}>
              Nei
            </Button>
          </ConfirmModalWithParent>
          <Button
            onClick={() =>
              updatePhotoConsent(
                {
                  semester: getSelectedSemester(),
                  domain: 'SOCIAL_MEDIA',
                  isConsenting: true,
                  updatedAt: undefined,
                },
                username
              )
            }
            className={getButtonClass(true, 'SOCIAL_MEDIA')}
          >
            Ja
          </Button>
        </div>
        <h4 className={styles.categoryTitle}>Abakus.no</h4>
        <h5>
          Jeg godtar at Abakus kan legge ut bilder av meg på Abakus.no i
          perioden {convertToReadableSemester(getSelectedSemester())}:
        </h5>
        <div className={styles.statusContainer}>
          <b>Sist oppdatert: </b>
          <i>{getConsentUpdatedAt('WEBSITE')}</i>
        </div>
        <div>
          <ConfirmModalWithParent
            closeOnConfirm={true}
            title="Trekke bildesamtykke på Abakus.no"
            message={
              'Er du sikker på at du vil trekke bildesamtykket ditt for ' +
              convertToReadableSemester(getSelectedSemester()) +
              ' på Abakus.no? Dette innebærer at noen må manuelt gå gjennom alle bildene fra arrangementene du har deltatt på i perioden ' +
              convertToReadableSemester(getSelectedSemester()) +
              ', og fjerne dem. Dersom du ønsker å fjerne noen spesifike bilder, kan du i stedet rapportere dem i galleriet, eller sende en epost til pr@abakus.no.'
            }
            onConfirm={() =>
              updatePhotoConsent(
                {
                  semester: getSelectedSemester(),
                  domain: 'WEBSITE',
                  isConsenting: false,
                  updatedAt: undefined,
                },
                username
              )
            }
          >
            <Button className={getButtonClass(false, 'WEBSITE')}>Nei</Button>
          </ConfirmModalWithParent>
          <Button
            onClick={() =>
              updatePhotoConsent(
                {
                  semester: getSelectedSemester(),
                  domain: 'WEBSITE',
                  isConsenting: true,
                  updatedAt: undefined,
                },
                username
              )
            }
            className={getButtonClass(true, 'WEBSITE')}
          >
            Ja
          </Button>
        </div>
      </Flex>
    );
  }
}

export default PhotoConsents;
