import {Page} from "@playwright/test";

export class PlaywrightDevPage {
    public page: Page
    constructor(page: Page) {
        this.page = page
    }
}