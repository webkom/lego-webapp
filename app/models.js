// @flow

/**
 * Type of entity IDs in our app. The fact that it is a string is an
 * implementation detail and not revealed to consuming code. Therefore, one
 * must use the utility functions toId and idToString when dealing with them.
 */
type ID = string;

export const toId = (value: string | number): ID => {
  if (typeof value === 'number') {
    return value.toString();
  }

  return value;
};

export const idToString = (value: ID): string => value;

export type GalleryPictureDto = {
  description?: string,
  active?: boolean,
  file?: string
};

export type GalleryPicture = {
  id: ID,
  description: string,
  active: boolean,
  file: string
};
