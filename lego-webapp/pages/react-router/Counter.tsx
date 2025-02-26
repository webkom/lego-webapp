import { useState } from 'react';
import { Link } from 'react-router';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <>
      <button type="button" onClick={() => setCount((count) => count + 1)}>
        Counter {count}
      </button>
      <Link to="/prepare">Prepare Test</Link>
    </>
  );
}
