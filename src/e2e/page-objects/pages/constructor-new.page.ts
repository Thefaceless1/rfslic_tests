import {Locator, Page} from "@playwright/test";
import {Elements} from "../../framework/elements/elements.js";
import {Date} from "../../framework/elements/date.js";
import {Input} from "../../framework/elements/input.js";
import {ProlicenseActions} from "../helpers/enums/prolicense-actions.js";
import {InputData} from "../helpers/input-data.js";
import {randomInt} from "crypto";
import {NonFilesDoctypes} from "../helpers/enums/non-files-doctypes.js";
import {ConstructorPage} from "./constructor.page.js";
import {MainMenuOptions} from "../helpers/enums/main-menu-options.js";

export class ConstructorNewPage extends ConstructorPage {
    constructor(page : Page) {
        super(page);
    }
    /**
     * Поле "Название пролицензии"
     */
    private prolicenseName : Locator = Elements.getElement(this.page,"//input[@name='name']");
    /**
     * Название созданной пролицензии
     */
    public createdProlicName : Locator = Elements.getElement(this.page,"//*[text()='Название пролицензии:']//following-sibling::*");
    /**
     * Поле "Сезон"
     */
    private season : Locator = Elements.getElement(this.page,"//*[contains(@class,'season__control')]");
    /**
     * Поле "Тип лицензии"
     */
    private licType : Locator = Elements.getElement(this.page,"//*[contains(@class,'type__control')]");
    /**
     * Поле "Название документа"
     */
    private docName : Locator = Elements.getElement(this.page,"//input[@placeholder='Введите название документа']");
    /**
     * Кнопка "Добавить документ"
     */
    private addDocButton : Locator = Elements.getElement(this.page,"//span[text()='Добавить документ']");
    /**
     * Поля с датами блока "Общая информация"
     */
    private dates : Locator = Elements.getElement(this.page,"//*[contains(@class,'datepicker')]//input");
    /**
     * Кнопка вызова действий для пролицензии
     */
    private  actionButton : Locator = Elements.getElement(this.page,"//button[.//span[contains(@class,'IconMeatball')]]");
    /**
     * Кнопка "Удалить"
     */
    private deleteButton : Locator = Elements.getElement(this.page,"//button[text()='Удалить']");
    /**
     * Кнопка "Добавить группу критериев"
     */
    private addGrpCritButton : Locator = Elements.getElement(this.page,"//button[contains(@class,'CriteriasMain_add_btn')]");
    /**
     * Поле "Название группы критериев"
     */
    private grpCrit = Elements.getElement(this.page,"//*[contains(@class,'groupName__placeholder')]");
    /**
     * Значения выпадающего списка поля "Название группы критериев"
     */
    private grpCritList : Locator = Elements.getElement(this.page,"//*[contains(@class,'groupName__option')]");
    /**
     * Созданные группы критериев
     */
    private createdGroups : Locator = Elements.getElement(this.page,"//*[contains(text(),'критерии')]");
    /**
     * Значения выпадающего списка действий
     */
    private actionsList : Locator = Elements.getElement(this.page,"//*[contains(@class,'ContextMenuLevelCanary-Item')]");
    /**
     * Выпадающий список значений поля "Сезон"
     */
    private seasons : Locator = Elements.getElement(this.page,"//*[contains(@class,'season__option')]");
    /**
     * Выпадающий список значений поля "Тип лицензий"
     */
    private licenseTypes : Locator = Elements.getElement(this.page,"//*[contains(@class,'type__option')]");
    /**
     * Поле "Номер" (критерия)
     */
    private criteriaNumber : Locator = Elements.getElement(this.page,"//input[@placeholder='Введите номер критерия']");
    /**
     * Поле "Разряд"
     */
    private rankCriteria : Locator = Elements.getElement(this.page,"//*[contains(@class,'category__control')]");
    /**
     * Значения выпадающего списка поля "Разряд"
     */
    private rankList : Locator = Elements.getElement(this.page,"//*[contains(@class,'category__option')]");
    /**
     * Поле "Название" (критерия)
     */
    private criteriaName : Locator = Elements.getElement(this.page,"//input[@placeholder='Введите название критерия']");
    /**
     * Поле "Тип критерия"
     */
    private criteriaType : Locator = Elements.getElement(this.page,"//*[contains(@class,'type__control')]");
    /**
     * Значения выпадающего списка поля "Тип критерия"
     */
    private criteriaTypeList : Locator = Elements.getElement(this.page,"//*[contains(@class,'type__option')]");
    /**
     * Чекбокс "Множественный критерий"
     */
    private multi : Locator = Elements.getElement(this.page,"//input[@name='isMulti']");
    /**
     * Поле "Минимальное количество"
     */
    private minCount : Locator = Elements.getElement(this.page,"//input[@name='minCount']");
    /**
     * Поле "Описание"
     */
    private description : Locator = Elements.getElement(this.page,"//textarea[@name='description']");
    /**
     * Поле "Дополнительный тип данных"
     */
    private additionalDataType : Locator = Elements.getElement(this.page,"//*[contains(@class,'additionalDocType__control')]");
    /**
     * Значения выпадающего списка поля "Дополнительный тип данных"
     */
    private additionalDataTypeList : Locator = Elements.getElement(this.page,"//*[contains(@class,'additionalDocType__option')]");
    /**
     * Кнопка "Опубликовать"
     */
    private publishButton : Locator = Elements.getElement(this.page,"//button[text()='Опубликовать']");
    /**
     * Кнопка "Снять с публикации"
     */
    private unpublishButton : Locator = Elements.getElement(this.page,"//button[text()='Снять с публикации']");
    /**
     * Перейти к списку созданных пролицензий и нажать "Создать пролицензию"
     */
    public async openConstructor () : Promise<void> {
        await this.clickOnMenuOption(MainMenuOptions.constructor);
        await this.createProlicButton.click();
    }
    /**
     * Получение действия для пролицензии по enum
     */
    private async actionByEnum (enumValue : ProlicenseActions) {
        const actionArray = await this.actionsList.all();
        for (const action of actionArray) {
            if (await action.textContent() == enumValue) return action;
        }
    }
    /**
     * Заполнение полей блока "Общая информация"
     */
    private async fillBasicInfo() : Promise<void> {
        await this.prolicenseName.type(InputData.randomWord);
        await this.season.click();
        await this.seasons.last().click();
        await this.licType.click();
        await this.licenseTypes.last().click();
        const allDates = await this.dates.all();
        for (const date of allDates) {
            await Date.fillDateInput(date,InputData.todayDate);
        }
    }
    /**
     * Изменение значений в полях блока "Общая информация"
     */
    public async changeBasicInfo() : Promise<void> {
        await this.editButton.first().click();
        await this.prolicenseName.type(InputData.randomWord);
        const allDates = await this.dates.all();
        for (const date of allDates) {
            await Date.fillDateInput(date,InputData.todayDate);
        }
        await this.saveButton.click();
    }
    /**
     * Заполнение полей блока "Документы для подачи заявки"
     */
    private async fillDocs() : Promise<void> {
        const docsCount : number = 3;
        for(let i = 1 ; i<=docsCount ; i++) {
            if (i != 1) await this.addDocButton.click();
            await this.docName.last().type(InputData.randomWord);
            await Input.uploadFiles(this.templates.last());
            await Elements.waitForVisible(this.docIcon.last());
            await Elements.waitForVisible(this.xlsxIcon.last());
        }
    }
    /**
     * Создание пролицензии
     */
    public async createProlicense() : Promise<void> {
         await this.fillBasicInfo();
         await this.fillDocs();
         await this.saveButton.click();
    }
    /**
     * Создание пролицензии по образцу
     */
    public async cloneProlicense() : Promise<void> {
        await this.actionButton.click();
        await this.actionsList.filter({hasText : ProlicenseActions.clone}).click();
        await this.prolicenseName.type(InputData.randomWord);
        await this.saveButton.click();
    }
    /**
     * Публикация пролицензии
     */
    public async publishProlicense() : Promise<void> {
        await this.actionButton.click();
        await this.actionsList.filter({hasText : ProlicenseActions.publish}).click();
        await this.publishButton.click();
    }
    /**
     * Снятие с публикации пролицензии
     */
    public async unpublishProlicense() : Promise<void> {
        await this.publishProlicense();
        await this.actionButton.click();
        await this.actionsList.filter({hasText : ProlicenseActions.unpublish}).click();
        await this.unpublishButton.click();
    }
    /**
     * Удаление пролицензии
     */
    public async deleteProlicense() : Promise<void> {
        await this.actionButton.click();
        const deleteValue = await this.actionByEnum(ProlicenseActions.delete);
        if (deleteValue) {
            await deleteValue.click();
            await this.deleteButton.click();
        }
    }
    /**
     * Создание групп критериев
     */
    public async createGrpCrit() : Promise<void> {
        let groupsCount : number;
        do {
            await Elements.waitForVisible(this.addGrpCritButton);
            await this.addGrpCritButton.click();
            await Elements.waitForVisible(this.grpCrit);
            await this.grpCrit.click();
            await Elements.waitForVisible(this.grpCritList.last());
            groupsCount = await this.grpCritList.count();
            await this.grpCritList.first().click();
            await this.experts.click();
            await Elements.waitForVisible(this.expertsList.last());
            const expertsCount = await this.expertsList.count();
            for (let i = 0; i<expertsCount; i++) {
                await this.expertsList.first().click();
            }
            await this.saveButton.click();
        }
        while (groupsCount > 3);
    }
    /**
     * Заполнение полей критерия
     */
    private async fillCriteriaInfo(index : number) : Promise<void> {
        await this.plusButton.nth(index).click();
        await this.criteriaNumber.type(InputData.randomWord)
        await this.rankCriteria.click();
        await this.rankList.first().click();
        await this.criteriaName.type(InputData.randomWord)
        await this.description.type(InputData.randomWord)
        await this.criteriaType.click();
        await this.criteriaTypeList.filter({hasText : "Документы"}).click();
    }
    /**
     * Заполнение полей документов критерия
     */
    private async fillCriteriaDocs() : Promise<void> {
        await this.addDocButton.click();
        await this.docName.last().type(InputData.randomWord);
        await this.additionalDataType.last().click();
        await Elements.waitForVisible(this.additionalDataTypeList.last());
        const dataTypeCount : number = await this.additionalDataTypeList.count();
        const randomNumb : number = randomInt(0,dataTypeCount);
        await this.additionalDataTypeList.nth(randomNumb).click();
        if (this.checkDocType(randomNumb)) {
            await Input.uploadFiles(this.templates.last());
            await Elements.waitForVisible(this.docIcon.last());
            await Elements.waitForVisible(this.xlsxIcon.last());
        }
    }
    /**
     * Проверка нужно ли добавлять выбранному типу документа критерия файлы
     */
    private checkDocType(randomNumb : number) : boolean {
        return (
            randomNumb != NonFilesDoctypes.participantsList &&
            randomNumb != NonFilesDoctypes.organization &&
            randomNumb != NonFilesDoctypes.ofi
        )
    }
    /**
     * Создание критериев
     */
    public async createCriteria() : Promise<void> {
        const groupsCount = await this.createdGroups.count();
        const docCount = 2;
        for(let i = 0; i < groupsCount; i++) {
            await this.fillCriteriaInfo(i);
            for(let i=0; i < docCount; i++) {
                await this.fillCriteriaDocs()
            }
            await this.saveButton.click();
        }
    }
}