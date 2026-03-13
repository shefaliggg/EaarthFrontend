/**
 * appConfig.js
 * src/config/appConfig.js
 *
 * Single source of truth for environment-level constants.
 *
 * RIGHT NOW: one studio, one project — IDs are hardcoded here.
 *
 * WHEN YOU ADD MULTI-PROJECT SUPPORT:
 *   Option A — switch to .env variables:
 *     VITE_STUDIO_ID=69494aa6df29472c2c6b5d8f
 *     VITE_PROJECT_ID=697c899668977a7ca2b27462
 *     then: const STUDIO_ID = import.meta.env.VITE_STUDIO_ID
 *
 *   Option B — read from URL params in each page:
 *     const { projectId } = useParams();
 *     change route to /projects/:projectId/offers/create
 *
 *   Option C — read from Redux auth state:
 *     const { studioId, projectId } = useSelector(selectActiveProject);
 */

export const APP_CONFIG = {
  STUDIO_ID:  "69494aa6df29472c2c6b5d8f",
  PROJECT_ID: "697c899668977a7ca2b27462",
};