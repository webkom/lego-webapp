import { parse } from 'qs';

interface PaginationNextQuery {
  cursor: string;
}

export const parsePaginationNextQuery = (
  query: string
): PaginationNextQuery => {
  const parsed = parse(query) as unknown as PaginationNextQuery;
  return { cursor: parsed.cursor };
};
