// @flow

import React from 'react';
import { Form, TextInput, TextEditor, Button } from 'app/components/Form';

function EventEditor() {
  return (
    <div>
      <h2>Create an event</h2>
      <Form onSubmit={(e) => e.preventDefault()}>
        <TextInput placeholder='Title' autoFocus />
        <TextEditor placeholder='Description' />
        <Button type='submit'>Save Event</Button>
      </Form>
    </div>
  );
}

export default EventEditor;
