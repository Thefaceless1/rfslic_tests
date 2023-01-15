import {Page} from "@playwright/test";

export class PlaywrightDevPage {
    public readonly page : Page
    constructor(page : Page) {
        this.page = page
    }
    /**
     * Переход по указанному url
     */
    public async goto (url : string)  {
        await this.page.goto(url);
    }
    /**
     * Текущий url
     */
    public get currentUrl () : string {
        const regExp = /\/#.+/;
        return this.page.url().match(regExp)!.join();
    }
}