import path from 'path';

/**
 * Where the app is allowed to write.
 *
 * In a container the working directory is replaced on every deploy, so state
 * kept there disappears. DATA_DIR points at a mounted volume instead — set it
 * to the volume's mount path (Railway, Fly, a plain Docker host) and the JSON
 * store, the session secret and uploaded files survive a redeploy.
 *
 * Unset, it falls back to the project directory, which is what local
 * development wants.
 */
export const DATA_ROOT = process.env.DATA_DIR || process.cwd();

/** JSON store and the development session secret. */
export const DB_DIR = path.join(DATA_ROOT, 'data');

/** Uploads that must never be served straight from the web root. */
export const PRIVATE_UPLOADS_DIR = path.join(DATA_ROOT, 'private', 'uploads');
