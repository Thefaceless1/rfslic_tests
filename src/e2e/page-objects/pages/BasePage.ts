import {PlaywrightDevPage} from "../../framework/helpers/PlaywrightDevPage.js";
import {expect, Locator, Page} from "@playwright/test";
import {Elements} from "../../framework/elements/Elements.js";
import {TableColumn} from "../helpers/enums/TableColumn.js";
import {Notifications} from "../helpers/enums/Notifications.js";
import {DbHelper} from "../../../db/db-helper.js";
import {ProlicTypes} from "../helpers/enums/ProlicTypes.js";

export class BasePage extends PlaywrightDevPage{
    constructor(page: Page) {
        super(page)
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
     * Button "Edit"
     */
    protected editButton: Locator = Elements.getElement(this.page,"//button[contains(@class,'Button_view_secondary') and not(contains(@name,'editButton'))][.//span[contains(@class,'IconEdit')]]")
    /**
     * Field "Document Templates"
     */
    protected templates: Locator = Elements.getElement(this.page,"//input[@type='file']")
    /**
     * Values of the drop-down list of the "Season" field
     */
    protected seasonValues: Locator = Elements.getElement(this.page,"//*[contains(@class,'season__option')]")
    /**
     * Field 'Experts'
     */
    protected experts: Locator = Elements.getElement(this.page,"//*[contains(@class,'experts__value-container')]")
    /**
     * dropdown values of field 'Experts'
     */
    protected expertsValues: Locator = Elements.getElement(this.page,"//*[contains(@class,'experts__option')]")
    /**
     * Field "Season"
     */
    protected season: Locator = Elements.getElement(this.page,"//*[contains(@class,'season__control')]")
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
    protected searchInput: Locator = Elements.getElement(this.page,"//input[contains(@class,'Table-module_filterElement')]")
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
     * Button "Submit"
     */
    protected submitButton: Locator = Elements.getElement(this.page,"//button[text()='Подтвердить']")
    /**
     * Search button to call a modal window for club workers, organizations, ofi
     */
    protected searchDataButton: Locator = Elements.getElement(this.page,"//button//span[contains(@class,'IconSearch')]")
    /**
     * Field 'Prolicense type'
     */
    protected prolicType: Locator = Elements.getElement(this.page,"//*[contains(@class,'proLicType__control')]")
    /**
     * Field "License type"
     */
    protected licType: Locator = Elements.getElement(this.page,"//*[contains(@class,'type__control') or contains(@class,'licType__control')]")
    /**
     * Field "License type" values
     */
    protected licTypeValues: Locator = Elements.getElement(this.page,"//*[contains(@class,'type__option') or contains(@class,'licType__option')]")
    /**
     * Fields with date type
     */
    protected dates: Locator = Elements.getElement(this.page,"//*[contains(@class,'datepicker')]//input[not(@disabled)]")
    /**
     * Field "Add document"
     */
    protected addDocButton: Locator = Elements.getElement(this.page,"//span[text()='Добавить документ']")
    /**
     * Field "Document name"
     */
    protected docName: Locator = Elements.getElement(this.page,"//input[@placeholder='Введите название документа']")
    /**
     * Field "Document description"
     */
    protected docDescription: Locator = Elements.getElement(this.page,"//textarea[@placeholder='Добавьте описание документа']")
    /**
     * Field with the fine amount for editing
     */
    protected fineAmountFieldEdition: Locator = Elements.getElement(this.page,"//input[@name='fine']")
    /**
     * License type 'РФС Ж'
     */
    protected rfsWomanLicType: Locator = Elements.getElement(this.page,"//*[(contains(@class,'type__option') or contains(@class,'licType__option')) and text()='РФС Ж']")
    /**
     * License type 'Аттестат ФНЛ'
     */
    protected certificateFnlLicType: Locator = Elements.getElement(this.page,"//*[(contains(@class,'type__option') or contains(@class,'licType__option')) and text()='Аттестат ФНЛ']")
    /**
     * Prolicense or License table row
     */
    protected tableRow: Locator = Elements.getElement(this.page,"//tr[contains(@class,'ant-table-row')]")
    /**
     * Button 'Forward'
     */
    protected forwardButton: Locator = Elements.getElement(this.page,"//span[text()='Вперёд']")
    /**
     * Button "Close notification"
     */
    private closeNotifyButton: Locator = Elements.getElement(this.page,"//span[contains(@class,'notice-close-icon')]")
    /**
     * Button "Publish"
     */
    protected publishButton: Locator = Elements.getElement(this.page,"//button[text()='Опубликовать']")
    /**
     * Button "Next"
     */
    protected nextButton: Locator = Elements.getElement(this.page,"//button[text()='Далее']")
    /**
     * Button "Add criteria groups"
     */
    protected addCriteriaGroupButton: Locator = Elements.getElement(this.page,"//*[contains(text(),'Добавить группу')]")
    /**
     * Field with criteria group name
     */
    protected criteriaGroupName: Locator = Elements.getElement(this.page,"//span[contains(text(),'критерии')]")
    /**
     * Button "Select"
     */
    public selectButton: Locator = Elements.getElement(this.page,"//button[text()='Выбрать']")
    /**
     * Button "Create"
     */
    protected createButton: Locator = Elements.getElement(this.page,"//button[text()='Создать']")
    /**
     * Button "Unpublish"
     */
    protected unpublishButton: Locator = Elements.getElement(this.page,"//button[text()='Снять с публикации']")
    /**
     * Bread crumb 'Main'
     */
    protected breadCrumbMain: Locator = Elements.getElement(this.page,"//span[contains(@class,'breadcrumb')]//a[text()='Главная']")
    /**
     * selected field 'Prolicense type' dropdown value
     */
    protected prolicTypeValue(selectedType: ProlicTypes): Locator {
        return Elements.getElement(this.page,`//*[contains(@class,'proLicType__option') and text()='${selectedType}']`);
    }
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
        return Elements.getElement(this.page,"//*[text()='Добавить']");
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
    public filterButtonByEnum(columnValue: TableColumn): Locator {
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
    public async filterByColumn(column: Locator, searchText: string): Promise<void> {
        await column.click();
        await this.searchInput.fill(searchText);
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
    /**
     * Delete created licenses, prolicenses and commissions
     */
    public async deleteCreatedData(): Promise<void> {
        const dbHelper = new DbHelper();
        await dbHelper.deleteLicense();
        await dbHelper.deleteProlicense();
        await dbHelper.deleteCommission();
        await dbHelper.deleteRules();
        await dbHelper.closeConnect();
    }
}