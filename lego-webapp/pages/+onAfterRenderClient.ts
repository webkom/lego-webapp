import { PageContextClient } from 'vike/types';

export async function onAfterRenderClient(_: PageContextClient) {
  document.querySelector('body')?.setAttribute('data-hydrated', 'true');
}
