import { ReactNode } from 'react';
import 'minireset.css/minireset.css';
import '~/styles/globals.css';
import '@webkom/lego-bricks/dist/style.css';

export default function LayoutDefault({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
