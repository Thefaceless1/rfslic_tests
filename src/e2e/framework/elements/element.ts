import {Locator, Page} from "@playwright/test";

export class Element {
    /**
     * Получение элемента страницы
     */
    public static getElement (page : Page, selector : string) : Locator {
        return page.locator(selector);
    }
    /**
     * Ожидание видимости элемента
     */
    public static async waitForVisible (element : Locator) {
        await element.waitFor({state : "visible"});
    }
}