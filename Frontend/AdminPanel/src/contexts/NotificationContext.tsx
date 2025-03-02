import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

interface Notification {
  id: string;
  message: string;
  type: AlertColor;
  read: boolean;
  timestamp: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (message: string, type: AlertColor) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications debe ser usado dentro de un NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

interface SnackbarNotificationState {
  open: boolean;
  message: string;
  type: AlertColor;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [snackbar, setSnackbar] = useState<SnackbarNotificationState>({
    open: false,
    message: '',
    type: 'info'
  });

  const unreadCount = notifications.filter(notification => !notification.read).length;

  const addNotification = (message: string, type: AlertColor = 'info') => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      message,
      type,
      read: false,
      timestamp: new Date()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Mostrar snackbar para notificaciones importantes
    if (type === 'warning' || type === 'error') {
      setSnackbar({
        open: true,
        message,
        type
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.type} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};