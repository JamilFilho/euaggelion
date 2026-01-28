import { createReader } from '@keystatic/core/reader';
import { createGitHubReader } from '@keystatic/core/reader/github';
import keystaticConfig from '@/keystatic.config';

import { cache } from 'react';
import { cookies, draftMode } from 'next/headers';

export const reader = cache(async () => {
  let isDraftModeEnabled = false;
  // draftMode throws in e.g. generateStaticParams
  try {
    isDraftModeEnabled = (await draftMode()).isEnabled;
  } catch {}

  if (isDraftModeEnabled) {
    const cookiesStore = await cookies();
    const branch = cookiesStore.get('ks-branch')?.value;
    const token = cookiesStore.get('keystatic-gh-access-token')?.value;

    if (branch && token) {
      return createGitHubReader(keystaticConfig, {
        // Replace the below with your repo org an name
        repo: 'JamilFilho/euaggelion',
        ref: branch,
        // Assuming an existing GitHub app
        token: token,
      });
    }
  }
  // If draft mode is off, or no token, use the regular reader
  return createReader(process.cwd(), keystaticConfig);
});