import {Locator, Page} from "@playwright/test";

export class BaseElement {
    /**
     * Получение элемента страницы
     */
    public static getElement (page : Page, selector : string) : Locator {
        return page.locator(selector);
    }
}