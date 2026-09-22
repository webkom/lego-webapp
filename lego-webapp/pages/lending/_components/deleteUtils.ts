export const parseLendableObjectId = (
  lendableObjectId: string | undefined,
): number | null => {
  if (!lendableObjectId) {
    return null;
  }

  const parsedId = Number(lendableObjectId);
  return Number.isInteger(parsedId) ? parsedId : null;
};
