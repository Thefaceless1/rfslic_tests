import {Locator, Page} from "@playwright/test";
import {Elements} from "../../../framework/elements/Elements.js";
import {RulesClassifierPage} from "../admin/RulesClassifierPage.js";

export class ConstructorPage extends RulesClassifierPage {
    constructor(page: Page) {
        super(page);
    }
    /**
     * Button "Create a prolicense"
     */
    public createProlicButton: Locator = Elements.getElement(this.page, "//button[text()='Создать пролицензию']")
}