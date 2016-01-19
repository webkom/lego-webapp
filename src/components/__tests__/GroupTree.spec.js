import React from 'react';
import expect from 'expect';
import GroupTree from '../GroupTree';
import TestUtils from 'react-addons-test-utils';
import TreeView from 'react-treeview';
import { Link } from 'react-router';

function setup(props = {}) {
  const renderer = TestUtils.createRenderer();
  renderer.render(<GroupTree {...props} />);
  const output = renderer.getRenderOutput();
  return { props, output, renderer };
}

const groups = [
  {
    description: 'cool group',
    id: 1,
    name: 'Cat'
  },
  {
    description: 'bad group',
    id: 2,
    name: 'Dog',
    parent: 1
  },
  {
    description: 'standalone group',
    id: 3,
    name: 'Bird'
  }
];

describe('components', () => {
  describe('GroupTree', () => {
    it('should render the child nodes as links', () => {
      const { output } = setup({ groups });
      expect(output).toIncludeJSX(<Link to='/admin/groups/2/settings'>Dog</Link>);
      expect(output).toIncludeJSX(<Link to='/admin/groups/3/settings'>Bird</Link>);
    });

    it('should render the root nodes correctly', () => {
      const { output } = setup({ groups });
      const [treeView, div] = output.props.children[1];
      expect(treeView.type).toEqual(TreeView);
      expect(treeView.key).toEqual('1');
      expect(div.type).toEqual('div');
      expect(div.key).toEqual('3');
    });

    it('should work with no groups', () => {
      const { output } = setup({ groups: [] });
      expect(output).toIncludeJSX(<h3>Groups</h3>);
    });

    it('should work with only root groups', () => {
      const rootGroups = groups.slice(0, 1);
      const { output } = setup({ groups: rootGroups });
      const [treeView] = output.props.children[1];
      expect(treeView.type).toEqual('div');
      expect(treeView.key).toEqual('1');
    });
  });
});
