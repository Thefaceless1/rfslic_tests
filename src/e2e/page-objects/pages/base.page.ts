import {PlaywrightDevPage} from "../../framework/helpers/playwright-dev-page.js";
import {expect, Locator, Page} from "@playwright/test";
import {Elements} from "../../framework/elements/elements.js";
import {Columns} from "../helpers/enums/columns.js";
import {Notifications} from "../helpers/enums/notifications.js";

export class BasePage extends PlaywrightDevPage{
    protected prolicenseName: string
    constructor(page: Page) {
        super(page)
        this.prolicenseName = ''
    }
    /**
     * Field "Select a role"
     */
    protected selectRole: Locator = Elements.getElement(this.page,"//*[contains(@class,'role__control')]")
    /**
     * Values of the drop-down list of the field "Select a role"
     */
    protected rolesList: Locator = Elements.getElement(this.page,"//*[contains(@class,'role__option')]")
    /**
     * Button "Add" (+)
     */
    protected plusButton: Locator = Elements.getElement(this.page,"//button[contains(@class,'Button_view_secondary')][.//span[contains(@class,'IconAdd')]]")
    /**
     * Button "Edit"
     */
    protected editButton: Locator = Elements.getElement(this.page,"//button[contains(@class,'Button_view_secondary') and not(contains(@name,'editButton'))][.//span[contains(@class,'IconEdit')]]")
    /**
     * Field "Select experts"
     */
    protected experts: Locator = Elements.getElement(this.page,"//*[contains(@class,'experts__indicators')]")
    /**
     * Values of the drop-down list of the field "Select experts"
     */
    protected expertsList: Locator = Elements.getElement(this.page,"//*[contains(@class,'experts__option')]")
    /**
     * Field "Document Templates"
     */
    protected templates: Locator = Elements.getElement(this.page,"//input[@type='file']")
    /**
     * Downloaded "doc" file picture
     */
    protected docIcon: Locator = Elements.getElement(this.page,"//*[contains(@class,'FileIconDoc')]")
    /**
     * Downloaded "xlsx" file picture
     */
    protected xlsxIcon: Locator = Elements.getElement(this.page,"//*[contains(@class,'FileIconXls')]")
    /**
     * Value input field in the "Prolicense name" field filter
     */
    protected searchInput: Locator = Elements.getElement(this.page,"//input[contains(@class,'Table_filterElement')]")
    /**
     * "Find" button in table column filter
     */
    protected searchButton: Locator = Elements.getElement(this.page,"//span[text()='Найти']")
    /**
     * Field "Comment"
     */
    protected comment: Locator = Elements.getElement(this.page,"//textarea[@name='comment']")
    /**
     * Button "Edit group" in a table
     */
    protected editTableButton: Locator = Elements.getElement(this.page,"//span[contains(@class,'IconEdit')]")
    /**
     * Search button to call a modal window for club workers, organizations, ofi
     */
    protected searchDataButton: Locator = Elements.getElement(this.page,"//button//span[contains(@class,'IconSearch')]")
    /**
     * Field "License type"
     */
    protected licType: Locator = Elements.getElement(this.page,"//*[contains(@class,'type__control') or contains(@class,'licType__control')]")
    /**
     * Button "Add criteria groups"
     */
    protected addGrpCritButton: Locator = Elements.getElement(this.page,"//*[contains(text(),'Добавить группу')]")
    /**
     * Fields with date type
     */
    protected dates: Locator = Elements.getElement(this.page,"//*[contains(@class,'datepicker')]//input")
    /**
     * Values of the drop-down list of the "License type" field
     */
    protected licenseTypes: Locator = Elements.getElement(this.page,"//*[contains(@class,'type__option') or contains(@class,'licType__option')]")
    /**
     * Prolicense or License table row
     */
    protected tableRow: Locator = Elements.getElement(this.page,"//tr[contains(@class,'ant-table-row')]")
    /**
     * Button "Close notification"
     */
    private closeNotifyButton: Locator = Elements.getElement(this.page,"//span[contains(@class,'notice-close-icon')]")
    /**
     * column "Number of a license" in Licenses table
     */
    protected numberLicenseColumn: Locator = Elements.getElement(this.page,"//td[@class='ant-table-cell'][2]")
    /**
     * Button "Delete"
     */
    protected get deleteButton(): Locator {
        return Elements.getElement(this.page,"//button[text()='Удалить']");
    }
    /**
     * Button "Delete" in a table
     */
    protected get deleteTableButton(): Locator {
        return Elements.getElement(this.page,"//span[contains(@class,'IconTrash')]");
    }
    /**
     * Field "Name"
     */
    protected get name(): Locator {
        return Elements.getElement(this.page,"//input[@name='name']");
    }
    /**
     * Button "Add"
     */
    protected get addButton(): Locator {
        return Elements.getElement(this.page,"//button[text()='Добавить']");
    }
    /**
     * Field "Description"
     */
    protected get description(): Locator {
        return Elements.getElement(this.page,"//*[@name='description' or @placeholder='Описание' or @placeholder='Введите описание']");
    }
    /**
     * Button "Save"
     */
    protected get saveButton(): Locator {
        return Elements.getElement(this.page,"//button[text()='Сохранить']");
    }
    /**
     * Checkboxes
     */
    public get checkbox(): Locator {
        return Elements.getElement(this.page,"//input[@type='checkbox' and not(@disabled) and not(contains(@name,'isGetNotify'))]");
    }
    /**
     * Get notification by text
     */
    public notification(text: string): Locator {
        return Elements.getElement(this.page,`//*[text()='${text}']`).last();
    }
    /**
     * Get "Filter" button by table column name
     */
    public filterButtonByEnum(columnValue: Columns): Locator {
        return Elements.getElement(this.page,`//span[contains(text(),'${columnValue}')]//following-sibling::span`);
    }
    /**
     * Change role rights
     */
    public async changeRoleRights(page: "users" | "roles"): Promise<void> {
        await this.waitCheckboxCount();
        const checkboxCount: number = await this.checkbox.count()-1;
        for(let i = 1; i<checkboxCount;i++) {
            if(i%2 == 0) await this.checkbox.nth(i).click();
        }
        await this.saveButton.click();
        (page == "roles") ?
            await expect(this.notification(Notifications.rightsChanged)).toBeVisible() :
            await expect(this.notification(Notifications.userRightsChanged)).toBeVisible();
    }
    /**
     * Set a table filter by a given column
     */
    public async filterByColumn(column: Locator): Promise<void> {
        await column.click();
        await this.searchInput.type(this.prolicenseName);
        await this.searchButton.click();
    }
    /**
     * Waiting for checkboxes to be visible
     */
    private async waitCheckboxCount(): Promise<void> {
        const checkboxCount: number = await this.checkbox.count();
        if(checkboxCount <= 1) await this.waitCheckboxCount();
    }
    /**
     * Close notifications
     */
    protected async closeNotifications(choice: "all" | "last"): Promise<void> {
        if(choice == "all") {
            if(await this.closeNotifyButton.last().isVisible()) {
                const notifyCount: number = await this.closeNotifyButton.count();
                for(let i = 0; i< notifyCount; i++) {
                    await this.closeNotifyButton.nth(i).click();
                }
            }
        }
        else {
            if(await this.closeNotifyButton.last().isVisible())
                await this.closeNotifyButton.last().click();
        }
    }
}