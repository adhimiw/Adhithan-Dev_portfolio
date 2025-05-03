import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { registerDevice, unregisterDevice } from '../services/deviceService';
import { useToast } from './ui/use-toast';

declare global {
  interface Window {
    OneSignal: any;
  }
}

const PushNotificationManager: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [initialized, setInitialized] = useState(false);
  const { toast } = useToast();

  // Initialize OneSignal
  useEffect(() => {
    if (!window.OneSignal) {
      // Load OneSignal script
      const script = document.createElement('script');
      script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        initializeOneSignal();
      };

      return () => {
        document.body.removeChild(script);
      };
    } else {
      initializeOneSignal();
    }
  }, []);

  // Handle authentication changes
  useEffect(() => {
    if (initialized) {
      if (isAuthenticated && user?.email) {
        // Set user ID for OneSignal (using email)
        window.OneSignal.login(user.email);
        
        // Set user tags
        window.OneSignal.User.addTag('role', user.role || 'user');
        window.OneSignal.User.addTag('email', user.email);
        
        // Register device with backend
        window.OneSignal.User.PushSubscription.getId().then((deviceId: string) => {
          if (deviceId) {
            registerDevice(deviceId)
              .then(result => {
                if (result.success) {
                  console.log('Device registered successfully');
                }
              })
              .catch(error => {
                console.error('Error registering device:', error);
              });
          }
        });
      } else {
        // Logout from OneSignal
        window.OneSignal.logout();
        
        // Unregister device from backend
        window.OneSignal.User.PushSubscription.getId().then((deviceId: string) => {
          if (deviceId) {
            unregisterDevice(deviceId).catch(error => {
              console.error('Error unregistering device:', error);
            });
          }
        });
      }
    }
  }, [isAuthenticated, user, initialized]);

  const initializeOneSignal = () => {
    if (window.OneSignal && !initialized) {
      const appId = import.meta.env.VITE_ONESIGNAL_APP_ID;
      
      if (!appId) {
        console.warn('OneSignal App ID not found in environment variables');
        return;
      }
      
      window.OneSignal.init({
        appId,
        allowLocalhostAsSecureOrigin: true,
        serviceWorkerPath: '/OneSignalSDKWorker.js',
        promptOptions: {
          slidedown: {
            prompts: [
              {
                type: 'push',
                autoPrompt: true,
                text: {
                  actionMessage: "Would you like to receive notifications when you receive new messages?",
                  acceptButton: "Allow",
                  cancelButton: "Cancel"
                },
                delay: {
                  pageViews: 1,
                  timeDelay: 20
                }
              }
            ]
          }
        }
      });
      
      // Listen for subscription changes
      window.OneSignal.User.PushSubscription.addEventListener('change', (event: any) => {
        console.log('OneSignal subscription changed:', event);
        
        const deviceId = event.current.id;
        
        if (deviceId && isAuthenticated) {
          // Register the new device
          registerDevice(deviceId).catch(error => {
            console.error('Error registering device:', error);
          });
        }
      });
      
      setInitialized(true);
    }
  };

  return null; // This component doesn't render anything
};

export default PushNotificationManager;
