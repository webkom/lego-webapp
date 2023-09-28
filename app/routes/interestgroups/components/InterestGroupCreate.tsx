import { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import { Content } from 'app/components/Content';
import GroupForm from 'app/routes/admin/groups/components/GroupSettings';
import NavigationTab from 'app/components/NavigationTab';

export default class InterestGroupEdit extends Component<{
  initialValues: Record<string, any>;
  removeGroup: (arg0: number) => Promise<any>;
  uploadFile: (arg0: string) => Promise<any>;
  handleSubmitCallback: (arg0: Record<string, any>) => Promise<any>;
}> {
  render() {
    const { initialValues, uploadFile, handleSubmitCallback } = this.props;
    return (
      <Content>
        <Helmet title="Opprett gruppe" />
        <NavigationTab
          title="Opprett Gruppe"
          back={{
            label: 'Tilbake',
            path: '/interest-groups',
          }}
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
