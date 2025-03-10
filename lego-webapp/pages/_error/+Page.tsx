import { usePageContext } from 'vike-react/usePageContext';
import HTTPError from '~/components/errors/HTTPError';
import { useAppSelector } from '~/redux/hooks';

export default function Page() {
  const { is404 } = usePageContext();
  const statusCode = useAppSelector((state) => state.router.statusCode);
  if (is404) {
    return <HTTPError statusCode={404} />;
  }
  return <HTTPError statusCode={statusCode ?? undefined} />;
}
