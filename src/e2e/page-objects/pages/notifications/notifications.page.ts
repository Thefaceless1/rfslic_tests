import {MainPage} from "../main.page.js";
import {expect, Locator, Page} from "@playwright/test";
import {Elements} from "../../../framework/elements/elements.js";
import {DbHelper} from "../../../../db/db-helper.js";
import {Notifications} from "../../helpers/enums/notifications.js";

export class NotificationsPage extends MainPage {
    constructor(page : Page) {
        super(page);
    }
    /**
     * Bell button
     */
    private bellButton : Locator = Elements.getElement(this.page,"//span[contains(@class,'IconRing')]");
    /**
     * List of unread messages
     */
    private unreadMessageList : Locator = Elements.getElement(this.page,"//*[contains(@class,'ContextMenuItem-Slot_position_center')]");
    /**
     * Icon with the number of unread messages
     */
    private countMessageIcon : Locator = Elements.getElement(this.page,"//sup");
    /**
     * Button "Show all"
     */
    private showAllButton : Locator = Elements.getElement(this.page,"//*[text()='Показать все']");
    /**
     * Message text
     */
    private messageText(page : Page) : Locator {
        return Elements.getElement(page,"//*[contains(@class,'NotificationInfoPage_message')]");
    }
    /**
     * Column "Date and time created"
     */
    private get createdDateColumn() : Locator {
        return Elements.getElement(this.page,"//td[@class='ant-table-cell'][3]");
    }
    /**
     * Button "Delete selected"
     */
    private get deleteSelectedButton() : Locator {
        return Elements.getElement(this.page,"//span[text()='Удалить выбранные']");
    }
    /**
     * Button "Delete from trash"
     */
    private get deleteFromTrashButton() : Locator {
        return Elements.getElement(this.page,"//span[text()='Удалить из корзины']");
    }
    /**
     * Button "Deleted notifications"
     */
    private get deletedNotificationsButton() : Locator {
        return Elements.getElement(this.page,"//span[text()='Удаленные уведомления']");
    }
    /**
     * Button "Delete without recovery"
     */
    private get deleteWithoutRecoveryButton() : Locator {
        return Elements.getElement(this.page,"//button[text()='Удалить без восстановления']");
    }
    /**
     * Button "Mark as read"
     */
    private get markAsReadButton() : Locator {
        return Elements.getElement(this.page,"//span[text()='Отметить как прочитанные']");
    }
    /**
     * Read message
     */
    private get readMessage() : Locator {
        return Elements.getElement(this.page,"//a//*[contains(@class,'Text_view_secondary')]");
    }
    /**
     * Open selected notification
     */
    public async viewSelectedNotification() : Promise<void> {
        const dbHelper = new DbHelper();
        await dbHelper.markAsUnreadMessages(this.userId);
        await dbHelper.closeConnect();
        await Elements.waitForVisible(this.countMessageIcon);
        await this.bellButton.click();
        await Elements.waitForVisible(this.unreadMessageList.first());
        const popupPromise = this.page.waitForEvent('popup');
        await this.unreadMessageList.first().click();
        const popup = await popupPromise;
        await popup.waitForLoadState();
        await expect(this.messageText(popup)).toBeVisible();
        await popup.close();
    }
    /**
     * Open all notifications
     */
    private async openAllNotifications() : Promise<void> {
        await this.bellButton.click();
        const popupPromise = this.page.waitForEvent('popup');
        await this.showAllButton.click();
        const popup = await popupPromise;
        await popup.waitForLoadState();
        this.page = popup;
    }
    /**
     * Move to trash notification
     */
    public async moveToTrash() : Promise<void> {
        await this.openAllNotifications();
        await Elements.waitForVisible(this.createdDateColumn.first());
        await this.checkbox.nth(1).click();
        await this.deleteSelectedButton.click();
        await this.deletedNotificationsButton.click();
        await Elements.waitForVisible(this.createdDateColumn.first());
        await expect(this.notification(Notifications.movedToTrash)).toBeVisible();
    }
    /**
     * Delete notification
     */
    public async deleteNotification() : Promise<void> {
        await this.checkbox.nth(1).click();
        await this.deleteFromTrashButton.click();
        await this.deleteWithoutRecoveryButton.click();
        await expect(this.notification(Notifications.deletedFromTrash)).toBeVisible();
    }
    /**
     * Mark notification as read
     */
    public async markAsRead() : Promise<void> {
        await this.page.goBack();
        await this.checkbox.nth(1).click();
        await this.markAsReadButton.click();
        await expect(this.notification(Notifications.markedAsRead)).toBeVisible();
        await expect(this.readMessage).toBeVisible();
    }
}