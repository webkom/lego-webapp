// @flow

import { useState } from 'react';
import Select from 'react-select';
import Button from 'app/components/Button';
import Flex from 'app/components/Layout/Flex';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';
import type { PhotoConsent } from 'app/models';
import moment from 'moment-timezone';
import {
  getConsent,
  PHOTO_CONSENT_DOMAINS,
  toReadableSemester,
} from 'app/routes/events/utils';
import styles from './PhotoConsents.css';

import { selectStyles, selectTheme } from 'app/components/Form/SelectInput';

const ConsentManager = ({
  consent,
  updateConsent,
  isMe,
}: {
  consent: ?PhotoConsent,
  updateConsent: (consent: PhotoConsent) => Promise<*>,
  isMe: boolean,
}) => {
  if (!consent) {
    return null;
  }

  const consentStatus =
    typeof consent.isConsenting === 'boolean'
      ? consent.isConsenting
        ? 'Du ga samtykket den '
        : 'Du trakk samtykket den '
      : 'Du har ikke tatt stilling til samtykket.';

  const presentableDomain =
    consent.domain === PHOTO_CONSENT_DOMAINS.WEBSITE
      ? 'Abakus.no'
      : 'Sosiale medier';
  return (
    <>
      <h4 className={styles.categoryTitle}>{presentableDomain}</h4>
      <h5>
        Jeg godtar at Abakus kan legge ut bilder av meg på {presentableDomain} i
        perioden {toReadableSemester(consent)}:
      </h5>
      <div className={styles.statusContainer}>
        {consentStatus}
        {typeof consent.isConsenting === 'boolean' ? (
          <i>{moment(consent.updatedAt).format('DD. MMM YYYY')}.</i>
        ) : (
          ''
        )}
      </div>
      <div className={styles.consentBtnContainer}>
        <ConfirmModalWithParent
          closeOnConfirm={true}
          title={`Trekke bildesamtykke på ${presentableDomain}`}
          message={`Er du sikker på at du vil trekke bildesamtykket ditt for ${toReadableSemester(
            consent
          )} på ${presentableDomain}? Dersom du ønsker å fjerne noen spesifikke bilder, kan du i stedet sende en mail til pr@abakus.no med informasjon om hvilke bilder du vil fjerne.`}
          onConfirm={() => updateConsent({ ...consent, isConsenting: false })}
        >
          <Button
            dark
            disabled={!isMe || consent.isConsenting === false}
            className={styles.consentBtn}
          >
            Trekk samtykke
          </Button>
        </ConfirmModalWithParent>
        <Button
          success
          disabled={!isMe || consent.isConsenting === true}
          onClick={() => updateConsent({ ...consent, isConsenting: true })}
          className={styles.consentBtn}
        >
          Behold samtykke
        </Button>
      </div>
    </>
  );
};

const PhotoConsents = ({
  photoConsents,
  username,
  updatePhotoConsent,
  userId,
  isMe,
}: {
  photoConsents: Array<PhotoConsent>,
  username: string,
  updatePhotoConsent: (
    photoConsent: PhotoConsent,
    username: string,
    userId: Number
  ) => Promise<*>,
  userId: Number,
  isMe: boolean,
}) => {
  const semesterOptions = photoConsents
    .slice(0)
    .filter(
      (photoConsent) => photoConsent.domain === PHOTO_CONSENT_DOMAINS.WEBSITE
    )
    .sort((a, b) => {
      if (a.year === b.year) {
        return a.semester === 'spring' ? 1 : -1;
      }

      return a.year > b.year ? -1 : 1;
    })
    .map((photoConsent) => ({
      label: toReadableSemester(photoConsent),
      value: { year: photoConsent.year, semester: photoConsent.semester },
    }));

  const [selectedSemesterOption, setSelectedSemesterOption] = useState(
    semesterOptions[0]
  );

  const updateConsent = (consent: PhotoConsent) =>
    updatePhotoConsent(consent, username, userId);
  return (
    <Flex column={true}>
      <label htmlFor="select-semester">
        <h3>Semester</h3>
      </label>
      <Select
        name="select-semester"
        clearable={false}
        options={semesterOptions}
        value={selectedSemesterOption}
        onChange={({ value }) =>
          setSelectedSemesterOption({ label: toReadableSemester(value), value })
        }
        theme={selectTheme}
        styles={selectStyles}
      />
      <ConsentManager
        consent={getConsent(
          PHOTO_CONSENT_DOMAINS.SOCIAL_MEDIA,
          selectedSemesterOption.value.year,
          selectedSemesterOption.value.semester,
          photoConsents
        )}
        updateConsent={updateConsent}
        isMe={isMe}
      />
      <ConsentManager
        consent={getConsent(
          PHOTO_CONSENT_DOMAINS.WEBSITE,
          selectedSemesterOption.value.year,
          selectedSemesterOption.value.semester,
          photoConsents
        )}
        updateConsent={updateConsent}
        isMe={isMe}
      />
    </Flex>
  );
};

export default PhotoConsents;
