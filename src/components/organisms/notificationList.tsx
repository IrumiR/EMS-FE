import { Link } from "react-router-dom";

const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const NotificationList = ({
  notifications,
  isLoading,
  isError,
}: {
  notifications: any[];
  isLoading: boolean;
  isError: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="text-sm text-gray-500 p-4">Loading notifications...</div>
    );
  }

  if (isError) {
    return (
      <div className="text-sm text-red-500 p-4">
        Failed to load notifications
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="text-sm text-gray-500 p-4">No new notifications</div>
    );
  }

  return (
    <div className="max-h-80 overflow-y-auto">
      {notifications.map((notification: any) => (
        <Link
          to={`/tasks/${notification.entityId}`}
          key={notification._id}
          className="block px-4 py-2 hover:bg-gray-100 border-b last:border-0"
        >
          <div className="text-sm font-medium text-gray-800">
            {notification.message}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            From: {notification.sender?.userName || "System"}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            {formatDate(notification.createdAt)}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default NotificationList;
