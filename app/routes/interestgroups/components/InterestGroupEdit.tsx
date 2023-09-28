import { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
import GroupForm from 'app/routes/admin/groups/components/GroupSettings';

export default class InterestGroupEdit extends Component<{
  interestGroup: Record<string, any>;
  initialValues: Record<string, any>;
  uploadFile: (arg0: string) => Promise<any>;
  handleSubmitCallback: (arg0: Record<string, any>) => Promise<any>;
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
