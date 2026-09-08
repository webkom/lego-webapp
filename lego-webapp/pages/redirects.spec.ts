import { resolveRoute } from 'vike/routing';
import { describe, expect, it } from 'vitest';
import config from './+config';

const redirects: Record<string, string> = config.redirects;

const resolveRedirect = (urlPathname: string) => {
  for (const [source, target] of Object.entries(redirects)) {
    const { match, routeParams } = resolveRoute(source, urlPathname);
    if (match) {
      return target.replace(/\*|@[^/]+/g, (token) =>
        token === '*' ? routeParams['*'] : routeParams[token.slice(1)],
      );
    }
  }
  return null;
};

describe('redirects', () => {
  it.each([
    '/events/interest',
    '/interest-groups/123',
    '/interest-groups/123/edit',
    '/interest-groups/new',
    '/interest-groups/info',
    '/interest-groups/money-application',
    '/interest-groups/create-application',
  ])('leaves the live route %s alone', (url) => {
    expect(resolveRedirect(url)).toBeNull();
  });

  it('never redirects to another redirect', () => {
    for (const target of Object.values(redirects)) {
      if (target.includes('*') || target.includes('?')) continue;
      expect(resolveRedirect(target)).toBeNull();
    }
  });
});
