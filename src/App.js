import axios from 'axios';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      (async () => {
        try {
          console.log('Notification.permission', Notification.permission);
          await askPermission();

          console.log('start', 'serviceWorker' in navigator, 'PushManager' in window);
          const registrations = await navigator.serviceWorker.getRegistrations();
          
          // for (let registration of registrations) {
          //   console.log('unregister', registration);
          //   await registration.unregister();
          // }

          if (registrations === undefined || registrations.length === 0) {
            const registration = await navigator.serviceWorker.register('/service-worker.js');
            console.log('registered service worker', registration);
          }

          const subscription = await subscribeUserToPush();
          console.log('subscription', subscription.toJSON());

          const res = await axios.post(
            `https://f6kphkcmle.execute-api.ap-northeast-2.amazonaws.com/stag/notification/webpush`,
            { subscription }
          );
          console.log(res.data);
        } catch (err) {
          console.error('Service Worker error', err);
        }
      })();
    }
  }, []);

  return <div className="App">init</div>;
}

export default App;

async function askPermission() {
  try {
    const permissionResult = await new Promise(function (resolve, reject) {
      const permissionResult = Notification.requestPermission(function (result) {
        resolve(result);
      });

      if (permissionResult) {
        permissionResult.then(resolve, reject);
      }
    });

    if (permissionResult !== 'granted') {
      throw new Error("We weren't granted permission.");
    }
  } catch (error) {
    console.error('Error in asking permission:', error);
  }
}

async function subscribeUserToPush() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: 'BCSH2ajf3UvNJWIVpJxngCPz2Eya00Ybf1Zm9pzsJMzaaTJ-4zhXUj25PWqqL7eO-KpMFw-z9v0nA7lvBP1Q1eE',
    };

    const pushSubscription = await registration.pushManager.subscribe(subscribeOptions);
    console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
    return pushSubscription;
  } catch (error) {
    console.error('Error in subscribing to push:', error);
  }
}
