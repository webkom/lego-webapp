import getEntityType from 'app/utils/getEntityType';
import type { ID } from 'app/store/models';
import type { EntityServerName } from 'app/utils/getEntityType';

export type ContentTarget = `${EntityServerName}-${ID}`;

export const parseContentTarget = (contentTarget: ContentTarget) => {
  const [serverTargetType, targetId] = contentTarget.split('-') as [
    EntityServerName,
    ID,
  ];
  const targetType = getEntityType(serverTargetType);

  return { targetType, targetId };
};
