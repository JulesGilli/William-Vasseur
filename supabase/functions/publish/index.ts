/**
 * Publish — rebuild the public site from what William has saved.
 *
 * Deployed with verify_jwt on: only a signed-in user reaches this code, and
 * it then checks that user is an admin before doing anything. All it does is
 * ask GitHub to run the deploy workflow, which pulls the content fresh.
 *
 * Secret expected (set in the dashboard, never in code or chat):
 *   GITHUB_PUBLISH_TOKEN — a fine-grained token limited to this one
 *                          repository, with "Actions: read and write".
 */
import { createClient } from 'npm:@supabase/supabase-js@2';

const REPO = 'JulesGilli/William-Vasseur';
const WORKFLOW = 'deploy.yml';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const reply = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') return reply(405, { error: 'Method not allowed' });

  // Who is asking: the caller's own session, checked by Supabase Auth.
  const asCaller = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
  });
  const { data: { user } } = await asCaller.auth.getUser();
  if (!user) return reply(401, { error: 'Not signed in' });

  // Whether they may: the admins list, read with the service role.
  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { data: admin } = await db.from('admins').select('user_id').eq('user_id', user.id).maybeSingle();
  if (!admin) return reply(403, { error: 'Not allowed to publish' });

  const token = Deno.env.get('GITHUB_PUBLISH_TOKEN');
  if (!token) return reply(503, { error: 'Publishing is not configured yet' });

  const res = await fetch(`https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW}/dispatches`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'william-vasseur-publish',
    },
    body: JSON.stringify({ ref: 'main' }),
  });

  // GitHub answers a queued run with 204 and no body.
  if (res.status !== 204) {
    console.error('github dispatch failed', res.status, await res.text());
    return reply(502, { error: 'GitHub refused the publish' });
  }
  return reply(200, { ok: true });
});
