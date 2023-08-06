import moment from 'moment-timezone';
import { useState } from 'react';
import Select from 'react-select';
import Button from 'app/components/Button';
import { selectStyles, selectTheme } from 'app/components/Form/SelectInput';
import Flex from 'app/components/Layout/Flex';
import { ConfirmModal } from 'app/components/Modal/ConfirmModal';
import type { PhotoConsent } from 'app/models';
import { PhotoConsentDomain } from 'app/models';
import { getConsent, toReadableSemester } from 'app/routes/events/utils';
import type { ID } from 'app/store/models';
import styles from './PhotoConsents.css';

const ConsentManager = ({
  consent,
  updateConsent,
  isCurrentUser,
}: {
  consent: PhotoConsent | null | undefined;
  updateConsent: (consent: PhotoConsent) => Promise<void>;
  isCurrentUser: boolean;
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
    consent.domain === PhotoConsentDomain.WEBSITE
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
        <ConfirmModal
          closeOnConfirm={true}
          title={`Trekke bildesamtykke på ${presentableDomain}`}
          message={`Er du sikker på at du vil trekke bildesamtykket ditt for ${toReadableSemester(
            consent
          )} på ${presentableDomain}? Dersom du ønsker å fjerne noen spesifikke bilder, kan du i stedet sende en e-post til pr@abakus.no med informasjon om hvilke bilder du vil fjerne.`}
          onConfirm={() => updateConsent({ ...consent, isConsenting: false })}
        >
          {({ openConfirmModal }) => (
            <Button
              onClick={openConfirmModal}
              dark
              disabled={!isCurrentUser || consent.isConsenting === false}
              className={styles.consentBtn}
            >
              Trekk samtykke
            </Button>
          )}
        </ConfirmModal>
        <Button
          success
          disabled={!isCurrentUser || consent.isConsenting === true}
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
  isCurrentUser,
}: {
  photoConsents: Array<PhotoConsent>;
  username: string;
  updatePhotoConsent: (
    photoConsent: PhotoConsent,
    username: string,
    userId: ID
  ) => Promise<void>;
  userId: ID;
  isCurrentUser: boolean;
}) => {
  const semesterOptions = photoConsents
    .slice(0)
    .filter(
      (photoConsent) => photoConsent.domain === PhotoConsentDomain.WEBSITE
    )
    .sort((a, b) => {
      if (a.year === b.year) {
        return a.semester === 'spring' ? 1 : -1;
      }

      return a.year > b.year ? -1 : 1;
    })
    .map((photoConsent) => ({
      label: toReadableSemester(photoConsent),
      value: {
        year: photoConsent.year,
        semester: photoConsent.semester,
      },
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
          setSelectedSemesterOption({
            label: toReadableSemester(value),
            value,
          })
        }
        theme={selectTheme}
        styles={selectStyles}
        instanceId="profile-consent-semester"
      />
      <ConsentManager
        consent={getConsent(
          PhotoConsentDomain.SOCIAL_MEDIA,
          selectedSemesterOption.value.year,
          selectedSemesterOption.value.semester,
          photoConsents
        )}
        updateConsent={updateConsent}
        isCurrentUser={isCurrentUser}
      />
      <ConsentManager
        consent={getConsent(
          PhotoConsentDomain.WEBSITE,
          selectedSemesterOption.value.year,
          selectedSemesterOption.value.semester,
          photoConsents
        )}
        updateConsent={updateConsent}
        isCurrentUser={isCurrentUser}
      />
    </Flex>
  );
};

export default PhotoConsents;
