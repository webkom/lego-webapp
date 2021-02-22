// @flow

import React, { Component } from 'react';
import Select from 'react-select';
import Button from 'app/components/Button';
import Flex from 'app/components/Layout/Flex';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';
import type { PhotoConsent, PhotoConsentDomain } from 'app/models';
import moment from 'moment-timezone';

import styles from './PhotoConsent.css';

type Props = {
  photoConsents: Array<PhotoConsent>,
  username: string,
  updatePhotoConsent: (
    PhotoConsent: PhotoConsent,
    username: string,
    userId: Number
  ) => Promise<*>,
  userId: Number,
  isMe: boolean,
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
    const {
      photoConsents,
      username,
      updatePhotoConsent,
      userId,
      isMe,
    } = this.props;
    const { selectedOption } = this.state;

    const getYear = (semesterStr: string): number =>
      parseInt(semesterStr.substr(1, 2));

    const getSemester = (semesterStr: string): string => semesterStr.charAt(0);

    const convertToReadableSemester = (semesterYear: string): string => {
      let result = '';
      if (getSemester(semesterYear) === 'H') {
        result = result + 'høsten 20';
      } else {
        result = result + 'våren 20';
      }

      result = result + getYear(semesterYear);
      return result;
    };

    const getSemesterList = (): Array<string> =>
      [...new Set(photoConsents.map((c) => c.semester))].sort((a, b) =>
        getYear(b) === getYear(a)
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

    const isConsenting = (domain: PhotoConsentDomain): ?boolean => {
      return getSelectedConsent(domain)?.isConsenting === true;
    };

    const isNotConsenting = (domain: PhotoConsentDomain): ?boolean => {
      return getSelectedConsent(domain)?.isConsenting === false;
    };

    const hasNotSelectedConsent = (domain: PhotoConsentDomain): boolean => {
      return getSelectedConsent(domain)?.isConsenting === null;
    };

    const getConsentStatus = (domain: PhotoConsentDomain) => {
      const consent = getSelectedConsent(domain);
      if (isConsenting(domain)) {
        return (
          <>
            <b>Du ga samtykket den </b>
            <i>{moment(consent?.updatedAt).format('DD. MMM YYYY')}.</i>
          </>
        );
      } else if (consent?.isConsenting === false) {
        return (
          <>
            <b>Du trakk samtykket den </b>
            <i>{moment(consent?.updatedAt).format('DD. MMM YYYY')}.</i>
          </>
        );
      }
      return <b>Du har ikke tatt stilling til samtykket.</b>;
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
          {getConsentStatus('SOCIAL_MEDIA')}
        </div>
        <div>
          <ConfirmModalWithParent
            closeOnConfirm={true}
            title="Trekke bildesamtykke på sosiale medier"
            message={
              'Er du sikker p\xe5 at du vil trekke bildesamtykket ditt for ' +
              convertToReadableSemester(getSelectedSemester()) +
              ' p\xe5 sosiale medier? Dette inneb\xe6rer at noen m\xe5 manuelt g\xe5 gjennom alle bildene fra arrangementene du har deltatt p\xe5 i perioden ' +
              convertToReadableSemester(getSelectedSemester()) +
              ', og fjerne dem. Dersom du \xf8nsker \xe5 fjerne noen spesifike bilder, kan du g\xe5 inn p\xe5 galleriet og trykke p\xe5 "Rapporter"-knappen p\xe5 de aktuelle bildene.'
            }
            onConfirm={() =>
              updatePhotoConsent(
                {
                  semester: getSelectedSemester(),
                  domain: 'SOCIAL_MEDIA',
                  isConsenting: false,
                  updatedAt: undefined,
                },
                username,
                userId
              )
            }
          >
            <Button
              className={styles.notConsentBtn}
              disabled={isNotConsenting('SOCIAL_MEDIA') || !isMe}
            >
              {hasNotSelectedConsent('SOCIAL_MEDIA')
                ? 'Nei'
                : isNotConsenting('SOCIAL_MEDIA')
                ? 'Du har trukket samtykket'
                : 'Trekk samtykket'}
            </Button>
          </ConfirmModalWithParent>
          {hasNotSelectedConsent('SOCIAL_MEDIA') && (
            <Button
              disabled={!isMe}
              onClick={() =>
                updatePhotoConsent(
                  {
                    semester: getSelectedSemester(),
                    domain: 'SOCIAL_MEDIA',
                    isConsenting: true,
                    updatedAt: undefined,
                  },
                  username,
                  userId
                )
              }
              className={styles.consentBtn}
            >
              Ja
            </Button>
          )}
        </div>
        <h4 className={styles.categoryTitle}>Abakus.no</h4>
        <h5>
          Jeg godtar at Abakus kan legge ut bilder av meg på Abakus.no i
          perioden {convertToReadableSemester(getSelectedSemester())}:
        </h5>
        <div className={styles.statusContainer}>
          {getConsentStatus('WEBSITE')}
        </div>
        <div>
          <ConfirmModalWithParent
            closeOnConfirm={true}
            title="Trekke bildesamtykke på Abakus.no"
            message={
              'Er du sikker p\xe5 at du vil trekke bildesamtykket ditt for ' +
              convertToReadableSemester(getSelectedSemester()) +
              ' p\xe5 Abakus.no? Dette inneb\xe6rer at noen m\xe5 manuelt g\xe5 gjennom alle bildene fra arrangementene du har deltatt p\xe5 i perioden ' +
              convertToReadableSemester(getSelectedSemester()) +
              ', og fjerne dem. Dersom du \xf8nsker \xe5 fjerne noen spesifike bilder, kan du g\xe5 inn p\xe5 galleriet og trykke p\xe5 "Rapporter"-knappen p\xe5 de aktuelle bildene.'
            }
            onConfirm={() =>
              updatePhotoConsent(
                {
                  semester: getSelectedSemester(),
                  domain: 'WEBSITE',
                  isConsenting: false,
                  updatedAt: undefined,
                },
                username,
                userId
              )
            }
          >
            <Button
              className={styles.notConsentBtn}
              disabled={isNotConsenting('WEBSITE') || !isMe}
            >
              {hasNotSelectedConsent('WEBSITE')
                ? 'Nei'
                : isNotConsenting('WEBSITE')
                ? 'Du har trukket samtykket'
                : 'Trekk samtykket'}
            </Button>
          </ConfirmModalWithParent>
          {hasNotSelectedConsent('WEBSITE') && (
            <Button
              disabled={!isMe}
              onClick={() =>
                updatePhotoConsent(
                  {
                    semester: getSelectedSemester(),
                    domain: 'WEBSITE',
                    isConsenting: true,
                    updatedAt: undefined,
                  },
                  username,
                  userId
                )
              }
              className={styles.consentBtn}
            >
              Ja
            </Button>
          )}
        </div>
      </Flex>
    );
  }
}

export default PhotoConsents;
