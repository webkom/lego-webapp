// @flow
import { Component } from 'react';
import { Helmet } from 'react-helmet-async';

import { Content } from 'app/components/Content';
import GroupForm from 'app/components/GroupForm';
import NavigationTab from 'app/components/NavigationTab';

export default class InterestGroupEdit extends Component<{
  initialValues: Object,
  removeGroup: (number) => Promise<*>,
  uploadFile: (string) => Promise<*>,
  handleSubmitCallback: (Object) => Promise<*>,
}> {
  render() {
    const { initialValues, uploadFile, handleSubmitCallback } = this.props;

    return (
      <Content>
        <Helmet title="Opprett gruppe" />
        <NavigationTab
          title="Opprett Gruppe"
          back={{ label: 'Tilbake', path: '/interest-groups' }}
        />

        <GroupForm
          handleSubmitCallback={handleSubmitCallback}
          uploadFile={uploadFile}
          initialValues={initialValues}
        />
      </Content>
    );
  }
}
