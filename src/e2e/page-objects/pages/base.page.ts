import {PlaywrightDevPage} from "../../framework/helpers/playwright-dev-page.js";
import {Locator, Page} from "@playwright/test";
import {Elements} from "../../framework/elements/elements.js";
import {Notifications} from "../helpers/enums/notifications.js";
import {Columns} from "../helpers/enums/columns.js";

export class BasePage extends PlaywrightDevPage{
    protected prolicenseName : string
    constructor(page : Page) {
        super(page)
        this.prolicenseName = ''
    }
    /**
     * Field "Select a role"
     */
    protected selectRole : Locator = Elements.getElement(this.page,"//*[contains(@class,'role__control')]");
    /**
     * Values of the drop-down list of the field "Select a role"
     */
    protected rolesList : Locator = Elements.getElement(this.page,"//*[contains(@class,'role__option')]");
    /**
     * Button "Add" (+)
     */
    protected plusButton : Locator = Elements.getElement(this.page,"//button[contains(@class,'Button_view_secondary')][.//span[contains(@class,'IconAdd')]]");
    /**
     * Button "Save"
     */
    protected saveButton = Elements.getElement(this.page,"//button[text()='Сохранить']");
    /**
     * Button "Delete"
     */
    protected deleteButton = Elements.getElement(this.page,"//button[text()='Удалить']");
    /**
     * Button "Cancel"
     */
    protected cancelButton = Elements.getElement(this.page,"//button[text()='Отменить']");
    /**
     * Button "Edit"
     */
    protected editButton : Locator = Elements.getElement(this.page,"//button[contains(@class,'Button_view_secondary')][.//span[contains(@class,'IconEdit')]]");
    /**
     * Field "Select experts"
     */
    protected experts : Locator = Elements.getElement(this.page,"//*[contains(@class,'experts__indicators')]");
    /**
     * Values of the drop-down list of the field "Select experts"
     */
    protected expertsList :Locator = Elements.getElement(this.page,"//*[contains(@class,'experts__option')]");
    /**
     * Field "Document Templates"
     */
    protected templates : Locator = Elements.getElement(this.page,"//input[@type='file']");
    /**
     * Downloaded "doc" file picture
     */
    protected docIcon : Locator = Elements.getElement(this.page,"//*[contains(@class,'FileIconDoc')]");
    /**
     * Downloaded "xlsx" file picture
     */
    protected xlsxIcon : Locator = Elements.getElement(this.page,"//*[contains(@class,'FileIconXls')]");
    /**
     * List of current notifications on the screen
     */
    protected notifications : Locator = Elements.getElement(this.page,"//div[contains(@class,'notice-message')]");
    /**
     * Value input field in the "Prolicense name" field filter
     */
    protected searchInput : Locator = Elements.getElement(this.page,"//input[contains(@class,'Table_filterElement')]");
    /**
     * "Find" button in table column filter
     */
    protected searchButton : Locator = Elements.getElement(this.page,"//span[text()='Найти']");
    /**
     * Field "Comment"
     */
    protected comment : Locator = Elements.getElement(this.page,"//textarea[@name='comment']")
    /**
     * Button "Add"
     */
    protected addButton : Locator = Elements.getElement(this.page,"//button[text()='Добавить']");
    /**
     * Checkboxes
     */
    public checkbox : Locator = Elements.getElement(this.page,"//input[@type='checkbox']");
    /**
     * Search button to call a modal window for club workers, organizations, ofi
     */
    protected searchDataButton : Locator = Elements.getElement(this.page,"//button//span[contains(@class,'IconSearch')]");
    /**
     * Field "License type"
     */
    protected licType : Locator = Elements.getElement(this.page,"//*[contains(@class,'type__control')]");
    /**
     * Field "Name"
     */
    protected name : Locator = Elements.getElement(this.page,"//input[@name='name']");
    /**
     * Fields with date type
     */
    protected dates : Locator = Elements.getElement(this.page,"//*[contains(@class,'datepicker')]//input");
    /**
     * Values of the drop-down list of the "License type" field
     */
    protected licenseTypes : Locator = Elements.getElement(this.page,"//*[contains(@class,'type__option')]");
    /**
     * Prolicense or License table row
     */
    protected tableRow : Locator = Elements.getElement(this.page,"//tr[contains(@class,'ant-table-row')]");
    /**
     * Get notification by enum
     */
    public notifyByEnum (enumValue : Notifications) : Locator {
        return this.notifications.filter({hasText : enumValue});
    }
    /**
     * Get "Filter" button by table column name
     */
    filterButtonByEnum(columnValue : Columns) : Locator {
        return Elements.getElement(this.page,`//span[contains(text(),'${columnValue}')]//following-sibling::span`);
    }
    /**
     * Change role rights
     */
    public async changeRoleRights() : Promise<void> {
        await Elements.waitForVisible(this.checkbox.first());
        const checkboxCount : number = await this.checkbox.count()-1;
        for(let i = 1; i<checkboxCount;i++) {
            if(i%2 == 0) await this.checkbox.nth(i).click();
        }
        await this.saveButton.click();
    }
    /**
     * Set a table filter by a given column
     */
    async filterByColumn(column : Locator) : Promise<void> {
        await column.click();
        await this.searchInput.type(this.prolicenseName);
        await this.searchButton.click();
    }
}