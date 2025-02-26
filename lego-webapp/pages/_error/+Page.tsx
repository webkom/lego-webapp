import { usePageContext } from 'vike-react/usePageContext';

export default function Page() {
  const { is404 } = usePageContext();
  if (is404) {
    return (
      <>
        <h1>404 Page Not Found</h1>
        <p>Noe gikk veldig galt, Webkom er på saken!</p>
      </>
    );
  }
  return (
    <>
      <h1>500 Internal Server Error</h1>
      <p>Noe gikk veldig galt, Webkom er på saken!</p>
    </>
  );
}
