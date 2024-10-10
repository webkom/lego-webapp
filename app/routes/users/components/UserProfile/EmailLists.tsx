import { Link } from 'react-router-dom';
import Tooltip from 'app/components/Tooltip';
import { ProfileSection } from 'app/routes/users/components/UserProfile/ProfileSection';
import type { EntityId } from '@reduxjs/toolkit';
import type { PublicEmailList } from 'app/store/models/EmailList';

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
  const emailListsMapping = allAbakusGroups
    .map((abakusGroup) => ({
      abakusGroup,
      emailLists: abakusEmailLists.filter((emailList) =>
        emailList.groups.includes(abakusGroup.id),
      ),
    }))
    .filter(({ emailLists }) => emailLists.length);

  const emailListsOnUser = abakusEmailLists.filter((emailList) =>
    emailList.users.includes(userId),
  );

  if (emailListsMapping.length + emailListsOnUser.length === 0) return;

  return (
    <ProfileSection title="E-postlister">
      {emailListsMapping.map(({ abakusGroup, emailLists }) => (
        <div key={abakusGroup.id}>
          <h4>E-postlister fra gruppen {abakusGroup.name}</h4>
          <ul>
            {emailLists.map((emailList) => (
              <li key={emailList.id}>
                <Tooltip content={emailList.name}>
                  {emailList.email}@abakus.no{' '}
                  {canEditEmailLists && (
                    <Link to={`/admin/email/lists/${emailList.id}`}>
                      <i
                        style={{
                          fontSize: 14,
                        }}
                      >
                        endre
                      </i>
                    </Link>
                  )}
                </Tooltip>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {emailListsOnUser.length > 0 && (
        <>
          <h4>Direkte koblet til deg som bruker</h4>
          <ul>
            {emailListsOnUser.map((emailList) => (
              <li key={emailList.id}>
                <Tooltip content={emailList.name}>
                  {emailList.email}@abakus.no{' '}
                  {canEditEmailLists && (
                    <Link to={`/admin/email/lists/${emailList.id}`}>
                      <i
                        style={{
                          fontSize: 14,
                        }}
                      >
                        endre
                      </i>
                    </Link>
                  )}
                </Tooltip>
              </li>
            ))}
          </ul>
        </>
      )}

      <div>
        <br />
        <i
          style={{
            fontSize: 14,
          }}
        >
          Kontakt Webkom på{' '}
          <a href="mailto:webkom@abakus.no"> webkom@abakus.no </a>
          hvis du mener noen av disse ikke er riktige
        </i>
      </div>
    </ProfileSection>
  );
};
