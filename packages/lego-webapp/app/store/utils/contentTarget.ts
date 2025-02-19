import getEntityType from 'app/utils/getEntityType';
import type { EntityId } from '@reduxjs/toolkit';
import type { EntityServerName } from 'app/utils/getEntityType';

export type ContentTarget = `${EntityServerName}-${EntityId}`;

export const parseContentTarget = (contentTarget: ContentTarget) => {
  const [serverTargetType, targetId] = contentTarget.split('-') as [
    EntityServerName,
    EntityId,
  ];
  const targetType = getEntityType(serverTargetType);

  return { targetType, targetId };
};
