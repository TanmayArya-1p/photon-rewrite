import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import {PollerD} from "./dispatcher-poller"
import {PollerRH} from "./RequestHandler"



const BACKGROUND_DISPATCHER_TASK = "photon-dispatcher"
const BACKGROUND_REQUEST_HANDLER_TASK = "photon-request-handler"


async function registerNotificationCategory() {
    await Notifications.setNotificationCategoryAsync('photon', [
      {
        identifier: 'stop',
        buttonTitle: 'Stop',
        options: { opensAppToForeground: false },
      },
    ]);
}


let notificationSent = false
let currentNotificationID = null

TaskManager.defineTask(BACKGROUND_DISPATCHER_TASK,async () => {
    try {
      PollerD()
      if(!notificationSent){
            notificationSent = true
            currentNotificationID = await Notifications.scheduleNotificationAsync({
                content: {
                    title: "🔄 Photon Sync is Running",
                    body: "Your photos are being synced in the background.",
                    data: { stopTask: true },
                    categoryIdentifier: 'photon',
                    priority: Notifications.AndroidNotificationPriority.MAX,
                    sticky: true,
                },
                trigger: null,
            });
            Notifications.addNotificationResponseReceivedListener(response => {
                const { data } = response.notification.request.content;
                if (data && data.stopTask === true) {
                    Notifications.dismissNotificationAsync(currentNotificationID)
                    terminateAllTasks().then(() => console.log("Background Tasks Terminated")).catch(err => console.error("Failed to Terminate Tasks:", err));
                }
              });
        }
      return receivedNewData ? BackgroundFetch.BackgroundFetchResult.NewData : BackgroundFetch.BackgroundFetchResult.NoData;
    } catch (error) {
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }
});

TaskManager.defineTask(BACKGROUND_REQUEST_HANDLER_TASK, () => {
    try {
      PollerRH()
      return receivedNewData ? BackgroundFetch.BackgroundFetchResult.NewData : BackgroundFetch.BackgroundFetchResult.NoData;
    } catch (error) {
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }
});


async function terminateAllTasks() {
    await BackgroundFetch.unregisterTaskAsync(BACKGROUND_DISPATCHER_TASK);
    await BackgroundFetch.unregisterTaskAsync(BACKGROUND_REQUEST_HANDLER_TASK);
    notificationSent = false;
}


async function registerTasks() {
    await TaskManager.unregisterAllTasksAsync()
    registerNotificationCategory()
    BackgroundFetch.registerTaskAsync(BACKGROUND_DISPATCHER_TASK, {
        minimumInterval: 60 * 1,
        stopOnTerminate: true,
        startOnBoot: false,
    })
    BackgroundFetch.registerTaskAsync(BACKGROUND_REQUEST_HANDLER_TASK, {
        minimumInterval: 60 * 1,
        stopOnTerminate: true,
        startOnBoot: false,
    })
}


module.exports = {registerTasks , terminateAllTasks }