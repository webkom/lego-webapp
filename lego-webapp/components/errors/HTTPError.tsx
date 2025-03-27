import { Flex, PageContainer } from '@webkom/lego-bricks';
import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { setStatusCode } from '~/redux/slices/routing';
import renderAbakus from './renderAbakus';

const HTTPMapping = {
  '400': 'Noe gikk galt med forespørselen',
  '401': 'Du er ikke logget inn',
  '402': 'Betaling påkrevd',
  '403': 'Denne siden har du ikke tilgang på',
  '404': 'Denne siden finnes ikke',
  '418': 'Jeg er en tekanne',
  '428': 'Forutsetning påkrevd',
  '450': 'Blokkert av Windows foreldrekontroll',
  '500': 'Noe gikk veldig galt, Webkom er på saken!',
  '509': 'Båndbreddebegrensning nådd',
  '1337': 'Hackerman',
};
const fallbackStatus = 404;

const getHTTPError = (statusCode?: number) =>
  HTTPMapping[statusCode || fallbackStatus];

type Props = {
  statusCode?: number;
};

const HTTPError = ({ statusCode }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const storedStatusCode = useAppSelector((state) => state.router.statusCode);

  const effectiveStatusCode = statusCode || storedStatusCode || fallbackStatus;

  useEffect(() => {
    if (!canvasRef.current) return;
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
        <a href="/lego-webapp/public">
          <canvas
            id="canvas"
            ref={canvasRef}
            style={{
              width: '100%',
            }}
          />
        </a>
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
