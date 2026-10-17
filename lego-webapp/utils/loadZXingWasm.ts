import { prepareZXingModule } from '@yudiel/react-qr-scanner';
import wasmUrl from 'zxing-wasm/reader/zxing_reader.wasm?url';

const loadZXingWasm = () => {
  const global = globalThis as { __zxingWasmLoaded?: boolean };
  if (!global.__zxingWasmLoaded && !import.meta.env.SSR) {
    prepareZXingModule({
      overrides: {
        locateFile: (path, prefix) => {
          if (import.meta.env.SSR) throw new Error('no srr plz');
          return path.endsWith('.wasm') ? wasmUrl : prefix + path;
        },
      },
    });
    global.__zxingWasmLoaded = true;
  }
};

export default loadZXingWasm;
