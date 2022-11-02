import { Component } from "react";
import { readmeIfy } from "app/components/ReadmeLogo";
import { Image } from "app/components/Image";
import { Flex } from "app/components/Layout";
import Icon from "app/components/Icon";
import styles from "./LatestReadme.css";
type Props = {
  expanded: boolean;
  readmes: Array<Record<string, any>>;
};
type State = {
  expanded: boolean;
};

class LatestReadme extends Component<Props, State> {
  state = {
    expanded: this.props.expanded
  };

  // eslint-disable-next-line
  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.expanded !== this.state.expanded) {
      this.setState({
        expanded: nextProps.expanded || false
      });
    }
  }

  render() {
    const {
      expanded
    } = this.state;

    const toggle = () => this.setState(state => ({
      expanded: !state.expanded
    }));

    const {
      readmes = []
    } = this.props;
    return <Flex column className={styles.latestReadme}>
        <button className={styles.heading} onClick={toggle}>
          <Flex justifyContent="space-between" alignItems="center">
            {readmeIfy('readme')}
            <Icon name={expanded ? 'close' : 'arrow-down'} />
          </Flex>
        </button>

        {expanded && <Flex wrap justifyContent="space-around" style={{
        paddingTop: 20
      }}>
            {readmes.slice(0, 4).map(({
          image,
          pdf,
          title
        }) => <a key={title} href={pdf} className={styles.thumb}>
                <Image src={image} />
              </a>)}
          </Flex>}
      </Flex>;
  }

}

export default LatestReadme;