function FormatChatTime(isoString) {
  const msgDate = new Date(isoString);
  const now = new Date();

  // Remove time part for comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgDay = new Date(
    msgDate.getFullYear(),
    msgDate.getMonth(),
    msgDate.getDate()
  );

  const diffDays = Math.floor((today - msgDay) / (1000 * 60 * 60 * 24));

  // Today → time
  if (diffDays === 0) {
    return msgDate.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  // Yesterday
  if (diffDays === 1) {
    return "Yesterday";
  }

  // Older → date only
  return msgDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default FormatChatTime;