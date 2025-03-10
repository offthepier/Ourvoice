import { SUBSCRIPTION_STATUS } from "src/constants/emailSubscription";
import { runEmailJobHTML } from "src/service/EmailService/Email.service";
import userInfoService from "src/service/GetUserInfoService";
import notificationService from "src/service/NotificationService";
import { generateNotificationText } from "src/utils/generateNotification";
import { titleCase } from "src/utils/stringTitleCse";
const moment = require("moment");

/**
 * This function sends daily summary notifications to all users based on their notifications from the
 * previous day.
 */
export const handler = async () => {
  let date = new Date();
  // date.setDate(date.getDate() - 1);

  /* This variable is used as a flag to control the execution of the while loop that follows. */
  let jobRunning = true;

  /*  This variable is used to keep track of the last evaluated key during pagination of the `getAllUsers`
      function. It is initially set to null, and then updated with the last evaluated key of the previous
      iteration of the loop. This allows the loop to continue from where it left off in the previous
      iteration, until all users have been processed. */
  let lastEvaluatedKey = null;

  while (jobRunning) {
    /*  The function returns a list of users and their information,  */
    const users = await userInfoService.getAllUsers(lastEvaluatedKey);

    console.log("Job Started");

    for (const user of users.users) {
      if (user.emailSubscription == SUBSCRIPTION_STATUS.INACTIVE) {
        console.log("skipped", user);
        continue;
      }
      const notificationsToday =
        await notificationService.getUserDailyNotifications(
          user.email,
          10,
          date
        );

      let notificationBody = `<h2>OurVoice</h2><h3>Hi ${titleCase(
        user.firstName
      )},</h3>
    <h4>Please find below the daily summary of your notifications</h4>
    <h4> Daily Summary - ${moment(date).format("MMM Do YYYY")} </h4>`;

      if (notificationsToday.length !== 0) {
        for (const notification of notificationsToday) {
          notificationBody =
            notificationBody +
            `<br/>  ${generateNotificationText(
              notification
            )} <span style="color: #888"> on ${moment(
              notification.createdAt
            ).format("MMMM Do YYYY, h:mm a")}</span> `;
        }

        notificationBody =
          notificationBody +
          `<br/><br/><br/> <p>Cheers,<br/>The OurVoice Team<p/> 
          <br/> <center> <a href=${process.env.UNSUBSCRIBE_URL}>Unsubscribe Email Notifications</a> </center>`;

        //Send Email
        await runEmailJobHTML({
          message: {
            body: notificationBody,
            subject: `OurVoice Daily Notification Summary [${moment(
              date
            ).format("MMM Do YYYY")}]`,
          },
          toAddresses: [user.email],
        });
      }
    }

    /* This code block is checking if the `lastEvaluatedKey` property exists in the `users` object
       returned by the `getAllUsers` function. If it exists, it means that there are more users to be
       processed, so the `lastEvaluatedKey` variable is updated with the value of
       `users.lastEvaluatedKey`, and the loop continues to run to process the remaining users. If it
       does not exist, it means that all users have been processed, so the loop is exited by setting
      `jobRunning` to `false`. */
    if (users.lastEvaluatedKey) {
      lastEvaluatedKey = users.lastEvaluatedKey;
      console.log("Going for another round");
    } else {
      console.log("Job Done");
      jobRunning = false;
    }
  }
};
