import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Notifications",() => {
    test("Notifications scenario",async ({notifications}) => {
        await test.step("View selected notification",async () => notifications.viewSelectedNotification());
        await test.step("Move notification to trash",async () => notifications.moveToTrash());
        await test.step("Deleting selected notification",async () => notifications.deleteNotification());
        await test.step("Mark notification as read",async () => notifications.markAsRead());
    })
})