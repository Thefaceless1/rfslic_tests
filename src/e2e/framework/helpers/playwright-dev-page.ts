import {Page} from "@playwright/test";

export class PlaywrightDevPage {
    protected readonly baseUrl : string ="https://rfs-lic-test-01.fors.ru";
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
}