import {Page} from "@playwright/test";

export class PlaywrightDevPage {
    public page : Page
    constructor(page : Page) {
        this.page = page
    }
    /**
     * Go to specified url
     */
    public async goto (url : string)  {
        await this.page.goto(url);
    }
}