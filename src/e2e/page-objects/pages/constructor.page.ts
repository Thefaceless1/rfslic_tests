import {MainPage} from "./main.page.js";
import {Locator, Page} from "@playwright/test";
import {Elements} from "../../framework/elements/elements.js";

export class ConstructorPage extends MainPage {
    constructor(page: Page) {
        super(page);
    }
    /**
     * Кнопка "Создать пролицензию"
     */
    protected createProlicButton: Locator = Elements.getElement(this.page, "//button[text()='Создать пролицензию']");
}