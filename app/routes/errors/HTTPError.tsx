import { Container, Flex } from '@webkom/lego-bricks';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import renderAbakus from './renderAbakus';

const HTTPMapping = {
  '400': 'Noe gikk galt med forespørselen',
  '401': 'Du er ikke logget inn',
  '403': 'Denne siden har du ikke tilgang på',
  '404': 'Denne siden finnes ikke',
  '500': 'Noe gikk veldig galt, Webkom er på saken!',
};
const fallbackStatus = 404;

const getHTTPError = (statusCode) =>
  HTTPMapping[statusCode] || HTTPMapping[fallbackStatus];

type Props = {
  statusCode: number;
  location: any;
  setStatusCode?: (statusCode: number | null | undefined) => void;
};
export default class HTTPError extends Component<Props> {
  canvas: HTMLElement | null | undefined;

  componentDidMount() {
    const { statusCode = fallbackStatus } = this.props;
    renderAbakus(statusCode.toString(), this.canvas);
  }

  // eslint-disable-next-line
  componentWillReceiveProps(nextProps: Props) {
    const { setStatusCode, location } = this.props;
    const { location: nextLocation } = nextProps;

    if (setStatusCode && location !== nextLocation) {
      setStatusCode(null);
    }
  }

  shouldComponentUpdate() {
    return true;
  }

  render() {
    const { statusCode = fallbackStatus } = this.props;
    return (
      <Container>
        <Flex
          column
          alignItems="center"
          justifyContent="center"
          style={{
            padding: '10px',
          }}
        >
          <Link to="/">
            <canvas
              id="canvas"
              ref={(canvas) => {
                this.canvas = canvas;
              }}
              style={{
                width: '100%',
              }}
            />
          </Link>
          <h1
            style={{
              textAlign: 'center',
            }}
          >
            {getHTTPError(statusCode)}
          </h1>
        </Flex>
      </Container>
    );
  }
}
