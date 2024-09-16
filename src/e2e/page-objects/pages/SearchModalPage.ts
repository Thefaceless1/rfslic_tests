import {BasePage} from "./BasePage.js";
import {Locator, Page} from "@playwright/test";
import {Elements} from "../../framework/elements/Elements.js";

export class SearchModalPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }
    /**
     * Button "Search"
     */
    public findButton: Locator = Elements.getElement(this.page,"//button[text()='Найти']")
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
    /**
     * Table cell with ofi name or member last name
     */
    public entityNameTableCell: Locator = Elements.getElement(this.page,"//td[contains(@class,'selection-column')]//following-sibling::td[1]")
}