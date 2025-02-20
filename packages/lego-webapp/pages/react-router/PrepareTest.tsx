import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '~/redux/rootReducer';
import { setTest } from '~/redux/slices/test';
import { appConfig } from '~/utils/appConfig';

export default function PrepareTest() {
  const dispatch = useDispatch();
  usePreparedEffect(
    '1',
    async () => {
      await new Promise((res) => setTimeout(res, 1000));
      dispatch(setTest('prepared!'));
    },
    [],
  );

  const value = useSelector((state: RootState) => state.test);

  return (
    <div>
      <Helmet>
        <title>Prepare Test</title>
      </Helmet>
      <pre>{value}</pre>
      <pre>{JSON.stringify(appConfig, undefined, 2)}</pre>
    </div>
  );
}
