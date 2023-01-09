import {PlaywrightDevPage} from "../../framework/helpers/playwright-dev-page.js";
import {Locator, Page} from "@playwright/test";
import {Element} from "../../framework/elements/element";
import {Notifications} from "../../framework/helpers/enums/notifications.js";

export class BasePage extends PlaywrightDevPage{
    constructor(page : Page) {
        super(page);
    }
    /**
     * Список текущих уведомлений на экране
     */
    public get notifications() : Locator {
        return Element.getElement(this.page,"//div[contains(@class,'notice-message')]");
    }
    /**
     * Получение уведомления по enum
     */
    public getNotifyByEnum (enumValue : Notifications) : Locator {
        return this.notifications.filter({hasText : enumValue});
    }
    /**
     * Поле ввода значения в фильтре поля "Название пролицензии"
     */
    public get prolicNameSearchInput() : Locator {
        return Element.getElement(this.page,"//input[contains(@class,'Table_filterElement')]");
    }
    /**
     * Кнопки "Фильтр" в поле "Наименование"(пролицензии)
     */
    public get prolicFilterButton() : Locator {
        return Element.getElement(this.page,"//span[contains(text(),'Название')]//following-sibling::span");
    }
    public get searchButton() : Locator {
        return Element.getElement(this.page,"//span[text()='Найти']");
    }
}