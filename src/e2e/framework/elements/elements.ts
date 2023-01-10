import {Locator, Page} from "@playwright/test";

export class Elements {
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
    /**
     * Ожидание невидимости элемента
     */
    public static async waitForNotVisible (element : Locator) {
        if(await element.isVisible()) setTimeout(() =>this.waitForNotVisible(element),500);
    }
    /**
     * Ожидание невидимости элемента
     */
    public static async waitForHidden (element : Locator) {
        await element.waitFor({state : "hidden"});
    }
}