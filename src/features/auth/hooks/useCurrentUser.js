import { useSelector } from "react-redux";

/**
 * Custom hook to access current user/admin data from Redux store
 * Works for Admin + User frontend
 */
export default function useCurrentUser() {
  const {
    currentUser,
    isLoading,
    isUpdating,
    error,
    successMessage,
    activityLog,
  } = useSelector((state) => state.user);

  const role = currentUser?.role;

  return {
    // Main user/admin data
    user: currentUser,

    // Loading states
    isLoading,
    isUpdating,

    // Messages
    error,
    successMessage,

    // Activity log
    activityLog,

    // Auth helpers
    isAuthenticated: !!currentUser,

    // Role helpers (ADMIN FRONTEND READY)
    isSuperAdmin: role === "super_admin",
    isAdmin: role === "admin" || role === "super_admin",
    isModerator: role === "moderator",
    isUser: role === "user",

    // Status helpers
    isActive: currentUser?.status === "active",
  };
}
