import React, { Component } from 'react';
import { Link } from 'react-router';
import DisplayVision from './DisplayVision';
import { Content } from 'app/components/Content';
import styles from './VisionPage.css';

class VisionPage extends Component {
  render() {
    return (
      <Content>
        <Link to={'/pages/about'}>-> Landing page</Link>

        <DisplayVision />
      </Content>
    );
  }
}

export default VisionPage;
