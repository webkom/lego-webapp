import { selectParent, selectSiblings } from '../pages';

const byId = {
  root: {
    pk: 1
  },
  first: {
    parent: 1,
  },
  second: {
    parent: 1
  }
};

describe('page reducer', () => {
  describe('#selectSiblings', () => {
    it('should default to empty object', () => {
      const state = {
        pages: { byId: {} }
      };

      const siblings = selectSiblings(state, { parentPk: 1 });
      expect(siblings).toEqual([]);
    });

    it('should find all siblings', () => {
      const state = { pages: { byId } };
      const siblings = selectSiblings(state, { parentPk: 1 });
      expect(siblings.length).toEqual(2);
    });
  });

  describe('#selectParent', () => {
    it('should find a page by parentPk', () => {
      const state = { pages: { byId } };
      const parent = selectParent(state, { parentPk: 1 });
      expect(parent.pk).toEqual(1);
    });
  });
});
