import {BasePage} from "./base.page.js";
import {Locator, Page} from "@playwright/test";
import {Elements} from "../../framework/elements/elements.js";

export class SearchModalPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }
    /**
     * Button "Search"
     */
    public findButton: Locator = Elements.getElement(this.page,"//button[contains(@class,'SearchModal_searchBtn')]")
    /**
     * Button "Select"
     */
    public selectButton: Locator = Elements.getElement(this.page,"//button[text()='Выбрать']")
    /**
     * Waiting indicator for table records
     */
    public loadIndicator: Locator = Elements.getElement(this.page,"//span[contains(@class,'ant-spin-dot-spin')]")
    /**
     * Table radio buttons with found values
     */
    public radio: Locator = Elements.getElement(this.page,"//input[@type='radio']")
    /**
     * Field "Enter name, last name or rfs id"
     */
    public search: Locator = Elements.getElement(this.page,"//input[@name='searchText']")
}