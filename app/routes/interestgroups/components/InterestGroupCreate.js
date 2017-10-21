// @flow
import React, { Component } from 'react';
import GroupForm from 'app/components/GroupForm';
import { Flex, Content } from 'app/components/Layout';
import { Link } from 'react-router';

export default class InterestGroupEdit extends Component<{
  initialValues: Object,
  removeInterestGroup: number => Promise<*>,
  uploadFile: string => Promise<*>,
  handleSubmitCallback: Object => Promise<*>
}> {
  render() {
    const { initialValues, uploadFile, handleSubmitCallback } = this.props;

    return (
      <Content>
        <h2>
          <Link to={`/interestGroups/`}>
            <i className="fa fa-angle-left" />
            Tilbake
          </Link>
        </h2>
        <Flex justifyContent="space-between" alignItems="baseline">
          <div>
            <h1>Opprett gruppe</h1>
          </div>
        </Flex>
        <GroupForm
          handleSubmitCallback={handleSubmitCallback}
          uploadFile={uploadFile}
          initialValues={initialValues}
        />
      </Content>
    );
  }
}
