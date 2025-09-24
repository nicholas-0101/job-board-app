"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Briefcase, Users, Calendar, CheckCircle } from "lucide-react";
import { useState } from "react";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: "job" | "application" | "interview" | "system";
  read: boolean;
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Job Match",
      message: "Senior Frontend Engineer at TechNova matches your profile",
      time: "2 min ago",
      type: "job",
      read: false,
    },
    {
      id: 2,
      title: "Application Viewed",
      message: "Your application for UI/UX Designer has been viewed",
      time: "1 hour ago",
      type: "application",
      read: false,
    },
    {
      id: 3,
      title: "Interview Scheduled",
      message: "Interview with Cloudify on Dec 25, 2024 at 10:00 AM",
      time: "3 hours ago",
      type: "interview",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "job": return <Briefcase className="w-4 h-4" />;
      case "application": return <CheckCircle className="w-4 h-4" />;
      case "interview": return <Calendar className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "job": return "bg-blue-100 text-blue-600";
      case "application": return "bg-green-100 text-green-600";
      case "interview": return "bg-purple-100 text-purple-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
          >
            {unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Notifications</h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1 hover:bg-white/50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                          !notification.read ? "bg-blue-50/30" : ""
                        }`}
                        whileHover={{ x: 2 }}
                      >
                        <div className="flex gap-3">
                          <div className={`p-2 rounded-lg ${getColor(notification.type)}`}>
                            {getIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-gray-900 text-sm">
                                  {notification.title}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                  {notification.message}
                                </p>
                              </div>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-gray-100 bg-gray-50">
                <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View all notifications →
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
