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
<<<<<<< HEAD
      <FlexRow>
        <FlexColumn> Hei </FlexColumn>
      </FlexRow>
=======
      <FlexRow>hei</FlexRow>
>>>>>>> b319fe7... Route to /announcements, fetch from backend
    </div>
  );
};

export default AnnouncementsList;
