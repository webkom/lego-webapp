// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import Button from 'app/components/Button';
import Card from 'app/components/Card';
import Time from 'app/components/Time';
import Icon from 'app/components/Icon';
import ProfilePicture from 'app/components/ProfilePicture';
import { lookupContext, contextRender } from '../context';

/**
 * Comments are grouped by the comment target and date.
 * This makes it possible to use the latest activity to generate the header.
 */
export function activityHeader(aggregatedActivity) {
  const latestActivity = aggregatedActivity.lastActivity;
  const actor = lookupContext(aggregatedActivity, latestActivity.actor);
  const target = lookupContext(aggregatedActivity, latestActivity.target);

  if (!(actor && target)) {
    return null;
  }

  return (
    <b>
      {contextRender[actor.contentType](actor)}
      {' '}
      kommenterte på
      {' '}
      {contextRender[target.contentType](target)}
    </b>
  );
}

export function activityContent(activity) {
  return (
    <div dangerouslySetInnerHTML={{ __html: activity.extraContext.content }} />
  );
}

export function icon(aggregatedActivity) {
  return <Icon name="text" />;
}
