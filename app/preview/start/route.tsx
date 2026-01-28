import { redirect } from 'next/navigation';
import { draftMode, cookies } from 'next/headers';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = url.searchParams;
  const branch = params.get('branch');
  const slug = params.get('slug');
  const to = params.get('to');
  if (!branch || (!slug && !to)) {
    return new Response('Missing branch or slug/to params', { status: 400 });
  }
  const draft = await draftMode();
  draft.enable();
  const cookieStore = await cookies();
  cookieStore.set('ks-branch', branch);
  const redirectUrl = to || `/${slug}`;
  redirect(redirectUrl);
}