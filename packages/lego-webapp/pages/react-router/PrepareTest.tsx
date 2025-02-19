import { usePreparedEffect } from '@webkom/react-prepare';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '~/redux/rootReducer';
import { setTest } from '~/redux/slices/test';

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
      <pre>{value}</pre>
    </div>
  );
}
