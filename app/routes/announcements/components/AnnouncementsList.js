// @flow

import React from 'react';
import Helmet from 'react-helmet';
import LoadingIndicator from 'app/components/LoadingIndicator/';
import { FlexRow, FlexColumn } from 'app/components/FlexBox';

type Props = {
  announcements: Array
};

const AnnouncementsList = ({ announcements, actionGrant }: Props) => {
  if (!announcements) {
    return <LoadingIndicator loading />;
  }
  return (
    <div>
      <Helmet title="Kunngjøringer" />
      <FlexRow>
        <FlexColumn> Hei </FlexColumn>
      </FlexRow>
    </div>
  );
};

export default AnnouncementsList;
