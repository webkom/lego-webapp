import { Button, ConfirmModal, Flex } from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import { useState } from 'react';
import { updatePhotoConsent } from 'app/actions/UserActions';
import SelectInput from 'app/components/Form/SelectInput';
import { PhotoConsentDomain } from 'app/models';
import { getConsent, toReadableSemester } from 'app/routes/events/utils';
import { useAppDispatch } from 'app/store/hooks';
import styles from './PhotoConsents.css';
import type { EntityId } from '@reduxjs/toolkit';
import type { PhotoConsent } from 'app/models';

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
            consent,
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
  userId,
  isCurrentUser,
}: {
  photoConsents: Array<PhotoConsent>;
  username: string;
  userId: EntityId;
  isCurrentUser: boolean;
}) => {
  const semesterOptions = photoConsents
    .slice(0)
    .filter(
      (photoConsent) => photoConsent.domain === PhotoConsentDomain.WEBSITE,
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
    semesterOptions[0],
  );

  const dispatch = useAppDispatch();

  const updateConsent = (consent: PhotoConsent) =>
    dispatch(updatePhotoConsent(consent, username, userId));

  return (
    <Flex column={true}>
      <label htmlFor="select-semester">
        <h3>Semester</h3>
      </label>
      <SelectInput
        name="select-semester"
        isClearable={false}
        options={semesterOptions}
        value={selectedSemesterOption}
        onChange={({ value }) =>
          setSelectedSemesterOption({
            label: toReadableSemester(value),
            value,
          })
        }
      />
      <ConsentManager
        consent={getConsent(
          PhotoConsentDomain.SOCIAL_MEDIA,
          selectedSemesterOption.value.year,
          selectedSemesterOption.value.semester,
          photoConsents,
        )}
        updateConsent={updateConsent}
        isCurrentUser={isCurrentUser}
      />
      <ConsentManager
        consent={getConsent(
          PhotoConsentDomain.WEBSITE,
          selectedSemesterOption.value.year,
          selectedSemesterOption.value.semester,
          photoConsents,
        )}
        updateConsent={updateConsent}
        isCurrentUser={isCurrentUser}
      />
    </Flex>
  );
};

export default PhotoConsents;
