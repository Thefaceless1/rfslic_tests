import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe.only("Notifications",() => {
    test("Notifications scenario",async ({notifications}) => {
        await test.step("View selected notification",async () => notifications.viewSelectedNotification());
        await test.step("Move notification to trash",async () => notifications.moveToTrash());
        await test.step("Deleting selected notification",async () => notifications.deleteNotification());
        await test.step("Mark notification as read",async () => notifications.markAsRead());
        await test.step("Changing notification subscriptions",async () => notifications.changeSubscription());
        await test.step("Adding a module",async () => notifications.addModule());
        await test.step("Adding notification template",async () => notifications.addTemplate());
    })
})