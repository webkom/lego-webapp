import React from 'react';
import expect from 'expect';
import QuotePage from '../QuotePage';
import { shallow } from 'enzyme';

const props = {
  routeParams: {
    filter: undefined
  },
  route: {
    path: "quotes"
  },
  quotes: [{
    approved: true,
    author: {
      firstName: "webkom",
      fullName: "webkom webkom",
      id: 1,
      lastName: "webkom",
      username: "webkom"
    },
    createdAt: "2015-11-07T22:05:36.881015Z",
    hasLiked: true,
    id: 1,
    likes: 1,
    permissions: {
      0: "can approve"
    },
    source: "kotlarz",
    text: "test quote 1",
    title: "test title 1"
  }, {
    approved: true,
    author: {
      firstName: "webkom",
      fullName: "webkom webkom",
      id: 1,
      lastName: "webkom",
      username: "webkom"
    },
    createdAt: "2015-11-07T22:05:36.881015Z",
    hasLiked: true,
    id: 2,
    likes: 1,
    permissions: {
      0: "can approve"
    },
    source: "meow",
    text: "test quote 2",
    title: "test title 2"
  }]
};

describe('components', () => {
  describe('QuotePage', () => {
    it('should show sort icons if page is a list of approved/unapproved quotes', () => {
      const wrapper = shallow(<QuotePage {...props} quotes={props.quotes} />);
      expect(wrapper.find('.sort').isEmpty()).toBe(false);
    });

    it('should NOT show sort icons if route is a single quote', () => {
      props.routeParams.filter = 1;
      const wrapper = shallow(<QuotePage {...props} quotes={props.quotes} />);
      expect(wrapper.find('.sort').isEmpty()).toBe(true);
    });

    it('should only display one quote if route is a single quote', () => {
      props.routeParams.filter = 1;
      props.route.path = "quotes/" + props.routeParams.filter;
      props.quotes.pop();
      const wrapper = shallow(<QuotePage {...props} quotes={props.quotes} />);
      expect(wrapper.find('.quotes').children().length === 1).toBe(true);
    });

    it('should display all the quotes if route is root', () => {
      const wrapper = shallow(<QuotePage {...props} quotes={props.quotes} />);
      expect(wrapper.find('.quotes').children().length === props.quotes.length).toBe(true);
    });
  });
});
