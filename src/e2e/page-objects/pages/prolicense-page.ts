import {Locator, Page} from "@playwright/test";
import {BaseElement} from "../../framework/elements/base-element.js";
import {Date} from "../../framework/elements/date.js";
import {Input} from "../../framework/elements/input.js";
import {PlaywrightDevPage} from "../../framework/helpers/playwright-dev-page.js";
import {ProlicenseActions} from "../../framework/helpers/enums/prolicense-actions.js";

export class ProlicensePage extends PlaywrightDevPage {
    constructor(page : Page) {
        super(page);
    }
    public readonly url : string = `${this.baseUrl}/#/constructor/new`;
    /**
     * Поле "Название пролицензии"
     */
    public get prolicenseName () : Locator {
        return BaseElement.getElement(this.page,"//input[@name='name']");
    }
    /**
     * Поле "Сезон"
     */
    public get season () : Locator {
        return BaseElement.getElement(this.page,"//*[contains(@class,'season__control')]");
    }
    /**
     * Поле "Тип лицензии"
     */
    public get licType () : Locator {
        return BaseElement.getElement(this.page,"//*[contains(@class,'type__control')]");
    }
    /**
     * Поле "Название документа"
     */
    public get docName () : Locator {
        return BaseElement.getElement(this.page,"//input[@placeholder='Введите название документа']");
    }
    /**
     * Кнопка "Добавить документ"
     */
    public get addDocButton () : Locator {
        return BaseElement.getElement(this.page,"//span[text()='Добавить документ']");
    }
    /**
     * Поле "Шаблоны документов"
     */
    public get templates () : Locator {
        return BaseElement.getElement(this.page,"//input[@type='file']");
    }
    /**
     * Поля с датами блока "Общая информация"
     */
    public get dates () {
        return BaseElement.getElement(this.page,"//*[contains(@class,'datepicker')]//input").all();
    }
    /**
     * Кнопка "Сохранить"
     */
    public get saveButton () {
        return BaseElement.getElement(this.page,"//button[text()='Сохранить']");
    }
    /**
     * Кнопка вызова действий для пролицензии
     */
    public get actionButton() : Locator {
        return BaseElement.getElement(this.page,"//button[.//span[contains(@class,'IconMeatball')]]");
    }
    /**
     * Кнопка "Удалить"
     */
    public get deleteButton() : Locator {
        return BaseElement.getElement(this.page,"//button[text()='Удалить']");
    }
    /**
     * Кнопка "Добавить группу критериев"
     */
    public get addGrpCritButton() : Locator {
        return BaseElement.getElement(this.page,"//span[text()='Добавить группу критериев']");
    }
    /**
     * Поле "Название группы критериев"
     */
    public get grpCrit() {
        return BaseElement.getElement(this.page,"//*[contains(@class,'groupName__placeholder')]");
    }
    /**
     * Значения выпадающего списка поля "Название группы критериев"
     */
    public get grpCritList() : Promise<Locator[]> {
        return BaseElement.getElement(this.page,"//*[contains(@class,'groupName__option')]").all();
    }
    /**
     * Поле "Выберите экспертов"
     */
    public get experts() : Locator {
        return BaseElement.getElement(this.page,"//*[contains(@class,'experts__placeholder')]");
    }
    /**
     * Значения выпадающего списка поля "Выберите экспертов"
     */
    public get expertsList() : Promise<Locator[]> {
        return BaseElement.getElement(this.page,"//*[contains(@class,'experts__option')]").all();
    }
    /**
     * Значения выпадающего списка действий
     */
    public get actionsList () : Promise<Locator[]> {
        return BaseElement.getElement(this.page,"//*[contains(@class,'ContextMenuLevelCanary-Item')]").all();
    }
    /**
     * Получение действия для пролицензии по enum
     */
    public async action (enumValue : ProlicenseActions) {
        const actionArray = await this.actionsList;
        for (const action of actionArray) {
            if (await action.textContent() == enumValue) return action;
        }
    }
    /**
     * Выпадающий список значений поля "Сезон"
     */
    public get seasons() : Promise<Locator[]> {
        return BaseElement.getElement(this.page,"//*[contains(@class,'season__option')]").all();
    }
    /**
     * Выпадающий список значений поля "Тип лицензий"
     */
    public get licenseTypes() : Promise<Locator[]> {
        return BaseElement.getElement(this.page,"//*[contains(@class,'type__option')]").all();
    }
    /**
     * Заполнение полей блока "Общая информация"
     */
    public async fillBasicInfo() : Promise<void> {
        await Input.fillInput(this.prolicenseName);
        await this.season.click();
        await this.seasons.then(seasons => seasons[seasons.length-1].click());
        await this.licType.click();
        await this.licenseTypes.then(types => types[types.length-1].click());
        const datesArray = await this.dates.then(dates => dates);
        for (const date of datesArray) {
            await Date.fillDateInput(date);
        }
    }
    /**
     * Заполнение полей блока "Документы для подачи заявки"
     */
    public async fillDocs() : Promise<void> {
        const docsCount : number = 5;
        for(let i = 1 ; i<=docsCount ; i++) {
            switch (i) {
                case 1 : {
                    await Input.fillInput(this.docName);
                    await Input.uploadFiles(this.templates);
                    break;
                }
                default : {
                    await this.addDocButton.click();
                    await Input.fillInput(this.docName.last());
                    await Input.uploadFiles(this.templates.last());
                }
            }
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
     * Удаление пролицензии
     */
    public async deleteProlicense() : Promise<void> {
        await this.actionButton.scrollIntoViewIfNeeded();
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
        let grpCritListArr : Locator[];
        do {
            await this.addGrpCritButton.waitFor({state : "visible"});
            await this.addGrpCritButton.scrollIntoViewIfNeeded();
            await this.addGrpCritButton.click();
            await this.grpCrit.click();
            grpCritListArr = await this.grpCritList.then(critGrp => critGrp);
            await grpCritListArr[0].click();
            await this.experts.click();
            const expertsListArr = await this.expertsList.then(experts => experts);
            for (let i = 0; i<expertsListArr.length; i++) {
                await expertsListArr[0].click();
            }
            await this.saveButton.click();
        }
        while (grpCritListArr.length > 1);
    }
}