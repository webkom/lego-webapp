import { useMemo } from 'react';
import Tooltip from '~/components/Tooltip';
import {
  InfoField,
  ProfileSection,
} from '~/pages/(migrated)/users/@username/_components/ProfileSection';
import type { EntityId } from '@reduxjs/toolkit';
import type { PublicEmailList } from '~/redux/models/EmailList';

interface Props {
  userId: EntityId;
  allAbakusGroups: {
    id: EntityId;
    name: string;
  }[];
  abakusEmailLists: PublicEmailList[];
  canEditEmailLists: boolean;
}

export const EmailLists = ({
  userId,
  allAbakusGroups,
  abakusEmailLists,
  canEditEmailLists,
}: Props) => {
  const emailListsMapping = useMemo(
    () =>
      allAbakusGroups
        .map((abakusGroup) => ({
          abakusGroup,
          emailLists: abakusEmailLists.filter((emailList) =>
            emailList.groups.includes(abakusGroup.id),
          ),
        }))
        .filter(({ emailLists }) => emailLists.length),
    [allAbakusGroups, abakusEmailLists],
  );

  const emailListsOnUser = useMemo(
    () =>
      abakusEmailLists.filter((emailList) => emailList.users.includes(userId)),
    [abakusEmailLists, userId],
  );

  if (emailListsMapping.length + emailListsOnUser.length === 0) return;

  return (
    <ProfileSection
      title="E-postlister"
      footer={
        <>
          Kontakt Webkom på{' '}
          <a href="mailto:webkom@abakus.no"> webkom@abakus.no </a>
          hvis du mener noen av disse ikke er riktige
        </>
      }
    >
      {emailListsMapping.map(({ abakusGroup, emailLists }) => (
        <InfoField
          key={abakusGroup.id}
          name={`Fra gruppen ${abakusGroup.name}`}
        >
          <ul>
            {emailLists.map((emailList) => (
              <li key={emailList.id}>
                <Tooltip content={emailList.name}>
                  {emailList.email}@abakus.no{' '}
                  {canEditEmailLists && (
                    <a href={`/admin/email/lists/${emailList.id}`}>
                      <i
                        style={{
                          fontSize: 14,
                        }}
                      >
                        endre
                      </i>
                    </a>
                  )}
                </Tooltip>
              </li>
            ))}
          </ul>
        </InfoField>
      ))}
      {emailListsOnUser.length > 0 && (
        <InfoField name="Direkte koblet til deg som bruker">
          <ul>
            {emailListsOnUser.map((emailList) => (
              <li key={emailList.id}>
                <Tooltip content={emailList.name}>
                  {emailList.email}@abakus.no{' '}
                  {canEditEmailLists && (
                    <a href={`/admin/email/lists/${emailList.id}`}>
                      <i
                        style={{
                          fontSize: 14,
                        }}
                      >
                        endre
                      </i>
                    </a>
                  )}
                </Tooltip>
              </li>
            ))}
          </ul>
        </InfoField>
      )}
    </ProfileSection>
  );
};
