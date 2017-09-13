import React, { Component } from 'react';
import ReadmeLogo from 'app/components/ReadmeLogo';
import Image from 'app/components/Image';
import { Flex } from 'app/components/Layout';
import Icon from 'app/components/Icon';
import styles from './LatestReadme.css';

class LatestReadme extends Component {
  state = {
    expanded: false
  };

  componentWillMount() {
    this.setState({
      expanded: this.props.expanded || false
    });
  }

  render() {
    const { expanded } = this.state;
    const toggle = () =>
      this.setState(state => ({ expanded: !state.expanded }));

    return (
      <Flex column className={styles.latestReadme}>
        <button className={styles.heading} onClick={toggle}>
          <Flex justifyContent="space-between">
            <span>
              <ReadmeLogo />-utgaver
            </span>
            <Icon
              name={expanded ? 'close' : 'arrow-down'}
              style={{ color: '#fff' }}
            />
          </Flex>
        </button>

        {expanded && (
          <Flex wrap justifyContent="space-between" style={{ paddingTop: 20 }}>
            {[1, 2, 3, 4, 5, 6].map(issue => (
              <a
                key={issue}
                href={`http://readme.abakus.no/utgaver/2016/2016-0${issue}.pdf`}
                className={styles.thumb}
              >
                <Image
                  src={`http://readme.abakus.no/bilder/2016/2016-0${issue}.jpg`}
                />
              </a>
            ))}
          </Flex>
        )}
      </Flex>
    );
  }
}

export default LatestReadme;
