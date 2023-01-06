import {PlaywrightDevPage} from "../../framework/helpers/playwright-dev-page.js";
import {Locator, Page} from "@playwright/test";
import {BaseElement} from "../../framework/elements/base-element.js";
import {Notifications} from "../../framework/helpers/enums/notifications.js";

export class BasePage extends PlaywrightDevPage{
    constructor(page : Page) {
        super(page);
    }
    /**
     * Список текущих уведомлений на экране
     */
    public get notifications() : Locator {
        return BaseElement.getElement(this.page,"//div[contains(@class,'notice-message')]");
    }
    /**
     * Получение уведомления по enum
     */
    public getNotifyByEnum (enumValue : Notifications) : Locator {
        return this.notifications.filter({hasText : enumValue});
    }
}