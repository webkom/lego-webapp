import { sortBy } from 'lodash-es';
import { Link } from 'react-router';
import {
  InfoField,
  ProfileSection,
} from 'app/routes/users/components/UserProfile/ProfileSection';
import type { EntityId } from '@reduxjs/toolkit';

interface Props {
  allAbakusGroupsWithPerms: {
    abakusGroup: {
      id: EntityId;
      name: string;
    };
    permissions: string[];
  }[];
}

export const Permissions = ({ allAbakusGroupsWithPerms }: Props) => {
  return (
    <ProfileSection title="Rettigheter">
      {allAbakusGroupsWithPerms.map(
        ({ abakusGroup, permissions }) =>
          !!permissions.length && (
            <InfoField
              key={abakusGroup.id}
              name={
                <>
                  Rettigheter fra gruppen{' '}
                  <Link to={`/admin/groups/${abakusGroup.id}/permissions/`}>
                    {abakusGroup.name}
                  </Link>
                </>
              }
            >
              <ul>
                {permissions.map((permission) => (
                  <li key={permission + abakusGroup.id}>{permission}</li>
                ))}
              </ul>
            </InfoField>
          ),
      )}
      <InfoField name="Sum alle rettigheter">
        <ul>
          {sortBy(
            allAbakusGroupsWithPerms.flatMap(({ permissions }) => permissions),
            (permission: string) => permission.split('/').length,
          )
            .reduce((acc: string[], perm: string) => {
              // Reduce perms to only show the broadest set of permissions
              // If a user has "/sudo/admin/events/" it means the user also has "/sudo/admin/events/create/" implicitly.
              // Therefore, we will only show "/sudo/admin/events/"
              const splittedPerm = perm.split('/').filter(Boolean);
              // YES, this has a bad runtime complexity, but since n is so small it doesn't matter in practice
              const [broaderPermFound] = splittedPerm.reduce(
                (accumulator, permPart) => {
                  const [broaderPermFound, summedPerm] = accumulator;
                  const concatedString = `${summedPerm}${permPart}/`;
                  return [
                    broaderPermFound || acc.includes(concatedString),
                    concatedString,
                  ];
                },
                [false, '/'],
              );
              if (broaderPermFound) return acc;
              return [...acc, perm];
            }, [])
            .map((permission) => (
              <li key={permission}>{permission}</li>
            ))}
        </ul>
      </InfoField>
    </ProfileSection>
  );
};
