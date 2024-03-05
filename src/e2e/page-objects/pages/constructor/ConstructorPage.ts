import {MainPage} from "../MainPage.js";
import {Locator, Page} from "@playwright/test";
import {Elements} from "../../../framework/elements/Elements.js";

export class ConstructorPage extends MainPage {
    constructor(page: Page) {
        super(page);
    }
    /**
     * Button "Create a prolicense"
     */
    public createProlicButton: Locator = Elements.getElement(this.page, "//button[text()='Создать пролицензию']")
}