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
  ImageUploadField
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

const Sidebar = ({ group }) =>
  <Flex column style={{ margin: '15px', width: '300px' }}>
    <Logo logo="https://i.imgur.com/Is9VKjb.jpg" />
    <Contact />
  </Flex>;

const SidebarHeader = ({ text }) =>
  <div style={{ 'font-weight': 'bold' }}>
    {text}
  </div>;

const Logo = ({ logo }) => <Image className={styles.logo} src={logo} />;

const Content = () =>
  <Flex style={{ flex: '1' }}>
    <Text />
  </Flex>;

const Text = () =>
  <Flex style={{ margin: '1em', flex: '1', width: '100%' }}>
    <Field
      name="descriptionLong"
      placeholder="Her kan du skrive mer om gruppen"
      initialValue="<p></p>"
      component={EditorField}
    />
  </Flex>;

const Contact = () =>
  <Flex column>
    <SidebarHeader text="Kontaktinformasjon" />
    <ul>
      <li>
        <Field
          name="contact-name"
          placeholder="Navn"
          component={TextInput.Field}
        />
      </li>
      <li>
        <Field
          name="contact-phone"
          placeholder="Telefon"
          component={TextInput.Field}
        />
      </li>
      <li>
        <Field
          name="contact-email"
          placeholder="E-post"
          component={TextInput.Field}
        />
      </li>
    </ul>
  </Flex>;

class InterestGroupCreate extends Component {
  create = (a, b, c) => {
    console.log('InterestGroupCreate.create');
    console.log(a);
    console.log(b);
    console.log(c);
  };

  render() {
    const { onSumit, handleSubmit } = this.props;
    const userId = this.props.currentUser.id;

    return (
      <Flex column className={styles.root}>
        <Form onSubmit={handleSubmit(this.create)}>
          <Title />
          <Description />
          <Flex style={{ background: 'white' }} justifyContent="space-between">
            <Content />
            <Sidebar />
          </Flex>
          <Button submit>Lag en interessegruppe</Button>
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
