import { Button, ButtonGroup, ConfirmModal } from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import { useState } from 'react';
import { updatePhotoConsent } from 'app/actions/UserActions';
import SelectInput from 'app/components/Form/SelectInput';
import { PhotoConsentDomain } from 'app/models';
import { getConsent, toReadableSemester } from 'app/routes/events/utils';
import {
  InfoField,
  ProfileSection,
} from 'app/routes/users/components/UserProfile/ProfileSection';
import { useAppDispatch } from 'app/store/hooks';
import styles from './PhotoConsents.module.css';
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
    <InfoField name={presentableDomain}>
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
      <ButtonGroup>
        <ConfirmModal
          closeOnConfirm={true}
          title={`Trekke bildesamtykke på ${presentableDomain}`}
          message={
            <>
              Er du sikker på at du vil trekke bildesamtykket ditt for
              {toReadableSemester(consent)} på {presentableDomain}? Dersom du
              ønsker å fjerne noen spesifikke bilder, kan du i stedet sende en
              e-post til <a href="mailto:pr@abakus.no">pr@abakus.no</a> med
              informasjon om hvilke bilder du vil fjerne.
            </>
          }
          onConfirm={() => updateConsent({ ...consent, isConsenting: false })}
        >
          {({ openConfirmModal }) => (
            <Button
              onPress={openConfirmModal}
              dark
              disabled={!isCurrentUser || consent.isConsenting === false}
            >
              Avslå samtykke
            </Button>
          )}
        </ConfirmModal>
        <Button
          success
          disabled={!isCurrentUser || consent.isConsenting === true}
          onPress={() => updateConsent({ ...consent, isConsenting: true })}
        >
          Gi samtykke
        </Button>
      </ButtonGroup>
    </InfoField>
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
    <ProfileSection title="Bildesamtykke">
      <InfoField name="Semester">
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
      </InfoField>

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
    </ProfileSection>
  );
};

export default PhotoConsents;
