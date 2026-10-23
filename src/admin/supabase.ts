import { createClient } from '@supabase/supabase-js';

/**
 * The editor talks to William's database directly, as William.
 *
 * Both values are public by design: the publishable key ships to every
 * browser, and on its own reaches only what is already published. What the
 * editor can change is decided by the database — the access policies let a
 * signed-in admin write and nobody else — not by anything in this file.
 */
export const SUPABASE_URL = 'https://jgxguuviojnwjideytyb.supabase.co';
const PUBLISHABLE_KEY = 'sb_publishable_BQ-X9n353xfbdy-CqFqeVg_0E4s2YXW';

export const supabase = createClient(SUPABASE_URL, PUBLISHABLE_KEY, {
  auth: { persistSession: true, storageKey: 'wv-editor-session' }
});

/** Public address of a file in the media bucket, for previews in the editor. */
export const mediaUrl = (key: string) =>
`${SUPABASE_URL}/storage/v1/object/public/media/${key}`;
