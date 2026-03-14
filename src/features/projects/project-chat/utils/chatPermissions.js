export const canUserSendMessage = (conversation, currentUserId) => {
  if (!conversation) {
    return { canSend: false, reason: "NO_CONVERSATION" };
  }

  const member = conversation.members?.find(
    (m) => String(m?.userId?._id) === String(currentUserId),
  );

  if (!member) {
    return { canSend: false, reason: "NOT_MEMBER" };
  }

  // contract expiration / temp restriction
  if (member?.canSendMessage === false) {
    return { canSend: false, reason: "TEMP_RESTRICTED" };
  }

  const roleId = String(member?.userId?.roleId);
  const messagePolicy = conversation?.settings?.messagePolicy;
  const allowedRoles = conversation?.settings?.allowedSenderRoles || [];

  const isRoleRestricted = messagePolicy === "ROLE_RESTRICTED";

  if (isRoleRestricted && !allowedRoles.includes(roleId)) {
    return { canSend: false, reason: "ROLE_RESTRICTED" };
  }

  return { canSend: true, reason: null };
};
