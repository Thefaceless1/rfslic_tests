import {MainPage} from "../main.page.js";
import {expect, Locator, Page} from "@playwright/test";
import {Elements} from "../../../framework/elements/elements.js";
import {DbHelper} from "../../../../db/db-helper.js";
import {Notifications} from "../../helpers/enums/notifications.js";
import {NotificationRoles} from "../../helpers/enums/notification-roles.js";
import {InputData} from "../../helpers/input-data.js";
import {randomInt} from "crypto";

export class NotificationsPage extends MainPage {
    private readonly moduleName : string = InputData.randomWord;
    private templateName : string = InputData.randomWord;
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
     * Button "Subscription to notifications"
     */
    private get subscriptionNotificationButton() : Locator {
        return Elements.getElement(this.page,"//span[text()='Подписка на уведомления']");
    }
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
     * Button "Administration"
     */
    private get administrationButton() : Locator {
        return Elements.getElement(this.page,"//span[text()='Администрирование']");
    }
    /**
     * Button "Navigation menu"
     */
    private get navigationMenuButton() : Locator {
        return Elements.getElement(this.page,"//*[contains(@class,'Navbar_menuButton')]//button");
    }
    /**
     * Button "Close navigation menu"
     */
    private get closeMenuButton() : Locator {
        return Elements.getElement(this.page,"//*[contains(@class,'ant-drawer-close')]//button");
    }
    /**
     * Field "Select module"
     */
    private get selectModule() : Locator {
        return Elements.getElement(this.page,"//*[contains(@class,'module__control')]");
    }
    /**
     * Dropdown values of field "Select module"
     */
    private moduleValue(moduleName : string) : Locator {
        return Elements.getElement(this.page,`//*[contains(@class,'module__option') and text()='${moduleName}']`);
    }
    /**
     * Button "Notification template management"
     */
    private get manageTemplateButton() : Locator {
        return Elements.getElement(this.page,"//li[contains(@data-menu-id,'template')]");
    }
    /**
     * Button "Module editor"
     */
    private get moduleEditButton () : Locator {
        return Elements.getElement(this.page,"//li[contains(@data-menu-id,'modules')]");
    }
    /**
     * Button "Add template"
     */
    private get addTemplateButton() : Locator {
        return Elements.getElement(this.page,"//button[text()='Добавить шаблон']");
    }
    /**
     * Field "Code"
     */
    private get code() : Locator {
        return Elements.getElement(this.page,"//input[@placeholder='Введите код']");
    }
    /**
     * Field "Title"
     */
    private get title() : Locator {
        return Elements.getElement(this.page,"//input[@placeholder='Введите заголовок']");
    }
    /**
     * Field "Template text"
     */
    private get templateText() : Locator {
        return Elements.getElement(this.page,"//textarea[contains(@placeholder,'Введите текст шаблона')]");
    }
    /**
     * Field "Period"
     */
    private get period() : Locator {
        return Elements.getElement(this.page,"//input[@name='period']");
    }
    /**
     * Get module by name
     */
    private getModuleByName(moduleName : string) : Locator {
        return Elements.getElement(this.page,`//td[text()='${moduleName}']`);
    }
    /**
     * Get template by name
     */
    private getTemplateByName(templateName : string) : Locator {
        return Elements.getElement(this.page,`//textarea[contains(@name,'title') and text()='${templateName}']`);
    }
    /**
     * Button "Add module"
     */
    private get addModuleButton() : Locator {
        return Elements.getElement(this.page,"//button[text()='Добавить модуль']");
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
    /**
     * Changing notification subscriptions
     */
    public async changeSubscription() : Promise<void> {
        await this.subscriptionNotificationButton.click();
        await Elements.waitForVisible(this.checkbox.first());
        const enabledCheckboxCount : number = await this.checkbox.count();
        for(let i = 1; i < enabledCheckboxCount; i++) {
            if(i%2 != 0) await this.checkbox.nth(i).click();
        }
        await this.saveButton.click();
        await expect(this.notification(Notifications.subscriptionChanged)).toBeVisible();
    }
    /**
     * User validation for notification module:
     * 1. Create the user if he doesn't exist
     * 2. Set admin role if the user has a different role
     */
    public async checkNotificationUser() : Promise<void> {
        const dbHelper = new DbHelper();
        const userRoleId = await dbHelper.getUserRoleId(this.userId);
        if(userRoleId.length < 1) await dbHelper.insertNotificationUser(this.userId);
        else if(userRoleId[0].user_id != NotificationRoles.admin) await dbHelper.setAdminRole(this.userId);
        await dbHelper.closeConnect();
    }
    /**
     * Navigate to the notification template management page
     */
    private async navigateTo(target : "manageTemplates" | "moduleEditor") : Promise<void> {
        await this.navigationMenuButton.click();
        await this.administrationButton.click();
        await Elements.waitForVisible(this.manageTemplateButton);
        (target == "manageTemplates") ?
            await this.manageTemplateButton.click() :
            await this.moduleEditButton.click();
        await this.closeMenuButton.click();
    }
    /**
     * Add a module
     */
    public async addModule() : Promise<void> {
        await this.navigateTo("moduleEditor");
        await this.addModuleButton.click();
        await this.name.type(this.moduleName);
        await this.description.type(InputData.randomWord);
        await this.addButton.click();
        await expect(this.getModuleByName(this.moduleName)).toBeVisible();
    }
    /**
     * Add a notification template
     */
    public async addTemplate() : Promise<void> {
        await this.navigateTo("manageTemplates");
        await this.selectModule.click();
        await Elements.waitForVisible(this.moduleValue(this.moduleName));
        await this.moduleValue(this.moduleName).click();
        await this.addTemplateButton.click();
        await this.code.type(InputData.randomWord);
        await this.title.type(this.templateName);
        await this.description.type(InputData.randomWord);
        await this.templateText.type(InputData.randomWord);
        const allCheckboxCount : number = await this.checkbox.count()
        const checkboxCountInWindow : number = 4;
        for (let i=allCheckboxCount-checkboxCountInWindow;i<allCheckboxCount;i++) {
            await this.checkbox.nth(i).click();
        }
        await this.period.type(String(randomInt(0, 100)));
        await this.addButton.click();
        await Elements.waitForHidden(this.addButton);
        await expect(this.getTemplateByName(this.templateName)).toBeVisible();
    }
    /**
     * Edit a notification template
     */
    public async editTemplate() : Promise<void> {
        const newTemplateName : string = InputData.randomWord;
        await this.getTemplateByName(this.templateName).fill(newTemplateName);
        this.templateName = newTemplateName;
        const checkboxCount : number = await this.checkbox.count();
        for (let i=0;i<checkboxCount;i++) {
            await this.checkbox.nth(i).click()
        }
        await this.saveButton.click();
        await expect(this.getTemplateByName(this.templateName)).toBeVisible();
    }
    public async deleteTemplate() : Promise<void> {
        await this.deleteTableButton.click();
        await this.deleteButton.click();
        await Elements.waitForHidden(this.deleteButton);
        await expect(this.getTemplateByName(this.templateName)).not.toBeVisible;
    }
}