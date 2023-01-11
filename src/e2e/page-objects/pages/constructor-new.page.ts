import {Locator, Page} from "@playwright/test";
import {Elements} from "../../framework/elements/elements.js";
import {Date} from "../../framework/elements/date.js";
import {Input} from "../../framework/elements/input.js";
import {ProlicenseActions} from "../helpers/enums/prolicense-actions.js";
import {InputData} from "../helpers/input-data.js";
import {randomInt} from "crypto";
import {NonFilesDoctypes} from "../helpers/enums/non-files-doctypes.js";
import {BasePage} from "./base.page.js";

export class ConstructorNewPage extends BasePage {
    constructor(page : Page) {
        super(page);
    }
    public readonly url : string = "/#/constructor/new";
    /**
     * Поле "Название пролицензии"
     */
    public prolicenseName : Locator = Elements.getElement(this.page,"//input[@name='name']");
    /**
     * Название созданной пролицензии
     */
    public createdProlicName : Locator = Elements.getElement(this.page,"//*[text()='Название пролицензии:']//following-sibling::*");
    /**
     * Поле "Сезон"
     */
    public season : Locator = Elements.getElement(this.page,"//*[contains(@class,'season__control')]");
    /**
     * Поле "Тип лицензии"
     */
    public licType : Locator = Elements.getElement(this.page,"//*[contains(@class,'type__control')]");
    /**
     * Поле "Название документа"
     */
    public docName : Locator = Elements.getElement(this.page,"//input[@placeholder='Введите название документа']");
    /**
     * Кнопка "Добавить документ"
     */
    public addDocButton : Locator = Elements.getElement(this.page,"//span[text()='Добавить документ']");
    /**
     * Поля с датами блока "Общая информация"
     */
    public dates : Locator = Elements.getElement(this.page,"//*[contains(@class,'datepicker')]//input");
    /**
     * Кнопка вызова действий для пролицензии
     */
    public  actionButton : Locator = Elements.getElement(this.page,"//button[.//span[contains(@class,'IconMeatball')]]");
    /**
     * Кнопка "Удалить"
     */
    public deleteButton : Locator = Elements.getElement(this.page,"//button[text()='Удалить']");
    /**
     * Кнопка "Добавить группу критериев"
     */
    public addGrpCritButton : Locator = Elements.getElement(this.page,"//button[contains(@class,'CriteriasMain_add_btn')]");
    /**
     * Поле "Название группы критериев"
     */
    public grpCrit = Elements.getElement(this.page,"//*[contains(@class,'groupName__placeholder')]");
    /**
     * Значения выпадающего списка поля "Название группы критериев"
     */
    public grpCritList : Locator = Elements.getElement(this.page,"//*[contains(@class,'groupName__option')]");
    /**
     * Созданные группы критериев
     */
    public createdGroups : Locator = Elements.getElement(this.page,"//*[contains(text(),'критерии')]");
    /**
     * Значения выпадающего списка действий
     */
    public actionsList : Locator = Elements.getElement(this.page,"//*[contains(@class,'ContextMenuLevelCanary-Item')]");
    /**
     * Выпадающий список значений поля "Сезон"
     */
    public seasons : Locator = Elements.getElement(this.page,"//*[contains(@class,'season__option')]");
    /**
     * Выпадающий список значений поля "Тип лицензий"
     */
    public licenseTypes : Locator = Elements.getElement(this.page,"//*[contains(@class,'type__option')]");
    /**
     * Поле "Номер" (критерия)
     */
    public criteriaNumber : Locator = Elements.getElement(this.page,"//input[@placeholder='Введите номер критерия']");
    /**
     * Поле "Разряд"
     */
    public rankCriteria : Locator = Elements.getElement(this.page,"//*[contains(@class,'category__control')]");
    /**
     * Значения выпадающего списка поля "Разряд"
     */
    public rankList : Locator = Elements.getElement(this.page,"//*[contains(@class,'category__option')]");
    /**
     * Поле "Название" (критерия)
     */
    public criteriaName : Locator = Elements.getElement(this.page,"//input[@placeholder='Введите название критерия']");
    /**
     * Поле "Тип критерия"
     */
    public criteriaType : Locator = Elements.getElement(this.page,"//*[contains(@class,'type__control')]");
    /**
     * Значения выпадающего списка поля "Тип критерия"
     */
    public criteriaTypeList : Locator = Elements.getElement(this.page,"//*[contains(@class,'type__option')]");
    /**
     * Чекбокс "Множественный критерий"
     */
    public multi : Locator = Elements.getElement(this.page,"//input[@name='isMulti']");
    /**
     * Поле "Минимальное количество"
     */
    public minCount : Locator = Elements.getElement(this.page,"//input[@name='minCount']");
    /**
     * Поле "Описание"
     */
    public description : Locator = Elements.getElement(this.page,"//textarea[@name='description']");
    /**
     * Поле "Дополнительный тип данных"
     */
    public additionalDataType : Locator = Elements.getElement(this.page,"//*[contains(@class,'additionalDocType__control')]");
    /**
     * Значения выпадающего списка поля "Дополнительный тип данных"
     */
    public additionalDataTypeList : Locator = Elements.getElement(this.page,"//*[contains(@class,'additionalDocType__option')]");
    /**
     * Кнопка "Опубликовать"
     */
    public publishButton : Locator = Elements.getElement(this.page,"//button[text()='Опубликовать']");
    /**
     * Кнопка "Снять с публикации"
     */
    public unpublishButton : Locator = Elements.getElement(this.page,"//button[text()='Снять с публикации']");
    /**
     * Получение действия для пролицензии по enum
     */
    public async action (enumValue : ProlicenseActions) {
        const actionArray = await this.actionsList.all();
        for (const action of actionArray) {
            if (await action.textContent() == enumValue) return action;
        }
    }
    /**
     * Заполнение полей блока "Общая информация"
     */
    public async fillBasicInfo() : Promise<void> {
        await this.prolicenseName.type(InputData.randomWord)
        await this.season.click();
        await this.seasons.last().click();
        await this.licType.click();
        await this.licenseTypes.last().click();
        const allDates = await this.dates.all();
        for (const date of allDates) {
            await Date.fillDateInput(date);
        }
    }
    /**
     * Заполнение полей блока "Документы для подачи заявки"
     */
    public async fillDocs() : Promise<void> {
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
        const deleteValue = await this.action(ProlicenseActions.delete);
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
        while (groupsCount > 1);
    }
    /**
     * Заполнение полей критерия
     */
    public async fillCriteriaInfo(index : number) : Promise<void> {
        await this.plusButton.nth(index).click();
        await this.criteriaNumber.type(InputData.randomWord)
        await this.rankCriteria.click();
        await this.rankList.first().click();
        await this.criteriaName.type(InputData.randomWord)
        await this.description.type(InputData.randomWord)
        await this.criteriaType.click();
        await this.criteriaTypeList.filter({hasText : "Документы"}).click();
        await this.multi.check();
        await this.minCount.type(InputData.randomIntForMulti);
    }
    /**
     * Заполнение полей документов критерия
     */
    public async fillCriteriaDocs() : Promise<void> {
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
    public checkDocType(randomNumb : number) : boolean {
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
        const docCount = 1;
        for(let i = 0; i < groupsCount; i++) {
            await this.fillCriteriaInfo(i);
            for(let i=0; i < docCount; i++) {
                await this.fillCriteriaDocs()
            }
            await this.saveButton.click();
        }
    }
}