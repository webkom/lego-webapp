import { useEffect, useState } from 'react';

/**
 * Wait for a global variable to be defined.
 * Useful when you need to wait for a script to load before using it.
 */
const waitForGlobal = <K extends keyof Window>(
  name: K,
  timeout: number = 2000,
) =>
  new Promise<Window[K]>((resolve, reject) => {
    let waited = 0;
    function wait(interval: number) {
      setTimeout(() => {
        waited += interval;
        if (window[name] !== undefined) {
          return resolve(window[name]);
        }
        if (waited >= timeout) {
          reject(
            new Error(
              `Timed out waiting for global variable ${name}. Is the script loaded?`,
            ),
          );
        } else {
          wait(interval * 2);
        }
      }, interval);
    }
    wait(30);
  });

export const useWaitForGlobal = <K extends keyof Window>(
  name: K,
  timeout?: number,
) => {
  const [value, setValue] = useState<Window[K]>();

  useEffect(() => {
    if (value === undefined) {
      waitForGlobal(name, timeout).then(setValue);
    }
  }, [name, timeout, value]);

  return value;
};
