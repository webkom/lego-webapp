import { Flex, PageContainer } from '@webkom/lego-bricks';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { setStatusCode } from 'app/reducers/routing';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import renderAbakus from './renderAbakus';

const HTTPMapping = {
  '400': 'Noe gikk galt med forespørselen',
  '401': 'Du er ikke logget inn',
  '403': 'Denne siden har du ikke tilgang på',
  '404': 'Denne siden finnes ikke',
  '500': 'Noe gikk veldig galt, Webkom er på saken!',
};
const fallbackStatus = 404;

const getHTTPError = (statusCode?: number) =>
  HTTPMapping[statusCode || fallbackStatus];

type Props = {
  statusCode?: number;
};

const HTTPError = ({ statusCode }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const storedStatusCode = useAppSelector((state) => state.router.statusCode);

  const effectiveStatusCode = statusCode || storedStatusCode || fallbackStatus;

  useEffect(() => {
    renderAbakus(effectiveStatusCode.toString(), canvasRef.current);
  }, [effectiveStatusCode, statusCode, storedStatusCode]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!statusCode && !storedStatusCode) {
      dispatch(setStatusCode(null));
    }
  }, [dispatch, statusCode, storedStatusCode]);

  return (
    <PageContainer card={false}>
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
            ref={canvasRef}
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
    </PageContainer>
  );
};

export default HTTPError;
