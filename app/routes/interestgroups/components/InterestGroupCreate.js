import styles from './InterestGroup.css';
import React, { Component } from 'react';
import Image from 'app/components/Image';
import Editor from 'app/components/Editor';
import { Flex } from 'app/components/Layout';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import { reduxForm, Field } from 'redux-form';
import {
  Form,
  EditorField,
  TextInput,
  Button,
  ImageUploadField,
  SelectInput
} from 'app/components/Form';

const Title = () =>
  <NavigationTab
    title={
      <Field name="name" placeholder="Gruppenavn" component={TextInput.Field} />
    }
  >
    <NavigationLink to={`/interestgroups/`}>[Tilbake]</NavigationLink>
  </NavigationTab>;

const Description = () =>
  <Flex className={styles.description}>
    <Field
      name="description"
      placeholder="Beskrivelse av gruppen"
      component={TextInput.Field}
    />
  </Flex>;

const Sidebar = ({ currentUser, invitedMembers, uploadFile }) =>
  <Flex column className={styles.sideBar}>
    <Logo logo="https://i.imgur.com/Is9VKjb.jpg" uploadFile={uploadFile} />
    <Contact currentUser={currentUser} invitedMembers={invitedMembers} />
  </Flex>;

const SidebarHeader = ({ text }) =>
  <div style={{ 'font-weight': 'bold' }}>
    {text}
  </div>;

const Logo = ({ logo, uploadFile }) =>
  <Field
    name="logo"
    component={ImageUploadField.Field}
    uploadFile={uploadFile}
    aspectRatio={1}
    img={logo}
  />;

const Content = () =>
  <Flex column style={{ flex: '1' }}>
    <Description />
    <Text />
  </Flex>;

const Text = () =>
  <Flex style={{ margin: '1em', flex: '1', width: '100%' }}>
    <Field
      name="descriptionLong"
      // placeholder="Her kan du skrive mer om gruppen"
      placeholder="hue"
      initialValue="<p></p>"
      component={EditorField}
    />
  </Flex>;

const Contact = ({ currentUser, invitedMembers }) => {
  return (
    <Flex column>
      <SidebarHeader text="Medlemmer" />
      <Field
        name="members"
        filter={['users.user']}
        component={SelectInput.AutocompleteField}
        multi
      />
      <SidebarHeader text="Leder" />
      <Field
        name="leader"
        component={SelectInput.Field}
        options={invitedMembers}
        simpleValue
      />
    </Flex>
  );
};

// const Contact = ({group}) => {
//   const leader = group.memberships.filter(m => m.role === 'leader');
//   if (leader.length === 0) {
//     return (
//       <Flex column>
//         <SidebarHeader text="Leder" />
//         Gruppen har ingen leder.
//       </Flex>
//     );
//   }
//   return (
//     <Flex column>
//       <SidebarHeader text="Leder" />
//       <div>{ group}</div>
//       <ul>
//         <li> <Field name="contact-name" placeholder="Navn" component={TextInput.Field}/> </li>
//         <li> <Field name="contact-phone" placeholder="Telefon" component={TextInput.Field}/> </li>
//         <li> <Field name="contact-email" placeholder="E-post" component={TextInput.Field}/> </li>
//       </ul>
//     </Flex>
//   );
// }

class InterestGroupCreate extends Component {
  create = data => {
    const groupData = {
      name: data.name,
      description: data.description,
      descriptionLong: data.descriptionLong,
      logo: data.logo
    };

    this.props.createInterestGroup(groupData).then(res => {
      const groupId = res.payload.result;
      const members = data.members || [];
      const memberships = members.map(m => ({
        id: m.value,
        role: m.value === data.leader ? 'leader' : 'member'
      }));
      // TODO: bulk add?
      memberships.map(m =>
        this.props.joinInterestGroup(groupId, { id: m.id }, m.role)
      );
    });
  };

  render() {
    const { handleSubmit, invitedMembers, uploadFile } = this.props;
    const userId = this.props.currentUser.id;

    return (
      <Flex column className={styles.root}>
        <Form onSubmit={handleSubmit(this.create)}>
          <Title />
          <Flex style={{ background: 'white' }} justifyContent="space-between">
            <Content />
            <Sidebar
              currentUser={this.props.currentUser}
              invitedMembers={invitedMembers}
              uploadFile={uploadFile}
            />
          </Flex>
          <Button style={{ 'max-width': '350px' }} submit>
            Lag en interessegruppe
          </Button>
        </Form>
      </Flex>
    );
  }
}

export default reduxForm({
  form: 'interestGroupCreate',
  validate(data) {
    const errors = {};
    return errors;
  }
})(InterestGroupCreate);
