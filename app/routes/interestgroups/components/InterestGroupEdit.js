// @flow
import { Component } from 'react';
import { Helmet } from 'react-helmet-async';

import { Content } from 'app/components/Content';
import GroupForm from 'app/components/GroupForm';
import NavigationTab from 'app/components/NavigationTab';

export default class InterestGroupEdit extends Component<{
  interestGroup: Object,
  initialValues: Object,
  uploadFile: (string) => Promise<*>,
  handleSubmitCallback: (Object) => Promise<*>,
}> {
  render() {
    const { interestGroup, initialValues, uploadFile, handleSubmitCallback } =
      this.props;

    return (
      <Content>
        <Helmet title={`Redigerer: ${interestGroup.name}`} />
        <NavigationTab
          title={`Redigerer: ${interestGroup.name}`}
          back={{
            label: 'Tilbake',
            path: `/interest-groups/${interestGroup.id}`,
          }}
        />
        <GroupForm
          handleSubmitCallback={handleSubmitCallback}
          group={interestGroup}
          uploadFile={uploadFile}
          initialValues={initialValues}
        />
      </Content>
    );
  }
}
