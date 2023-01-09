import {Locator, Page} from "@playwright/test";
import {Element} from "../../framework/elements/element";
import {Date} from "../../framework/elements/date.js";
import {Input} from "../../framework/elements/input.js";
import {ProlicenseActions} from "../../framework/helpers/enums/prolicense-actions.js";
import {InputData} from "../../framework/helpers/input-data.js";
import {randomInt} from "crypto";
import {NonFilesDoctypes} from "../../framework/helpers/enums/non-files-doctypes.js";
import {BasePage} from "./base-page.js";

export class ConstructorNewPage extends BasePage {
    constructor(page : Page) {
        super(page);
    }
    public readonly url : string = "/#/constructor/new";
    /**
     * Поле "Название пролицензии"
     */
    public get prolicenseName () : Locator {
        return Element.getElement(this.page,"//input[@name='name']");
    }
    /**
     * Название созданной пролицензии
     */
    public get createdProlicName() : Locator {
        return Element.getElement(this.page,"//*[text()='Название пролицензии:']//following-sibling::*");
    }
    /**
     * Поле "Сезон"
     */
    public get season () : Locator {
        return Element.getElement(this.page,"//*[contains(@class,'season__control')]");
    }
    /**
     * Поле "Тип лицензии"
     */
    public get licType () : Locator {
        return Element.getElement(this.page,"//*[contains(@class,'type__control')]");
    }
    /**
     * Поле "Название документа"
     */
    public get docName () : Locator {
        return Element.getElement(this.page,"//input[@placeholder='Введите название документа']");
    }
    /**
     * Кнопка "Добавить документ"
     */
    public get addDocButton () : Locator {
        return Element.getElement(this.page,"//span[text()='Добавить документ']");
    }
    /**
     * Поле "Шаблоны документов"
     */
    public get templates () : Locator {
        return Element.getElement(this.page,"//input[@type='file']");
    }
    /**
     * Поля с датами блока "Общая информация"
     */
    public get dates () {
        return Element.getElement(this.page,"//*[contains(@class,'datepicker')]//input");
    }
    /**
     * Кнопка "Сохранить"
     */
    public get saveButton () {
        return Element.getElement(this.page,"//button[text()='Сохранить']");
    }
    /**
     * Кнопка вызова действий для пролицензии
     */
    public get actionButton() : Locator {
        return Element.getElement(this.page,"//button[.//span[contains(@class,'IconMeatball')]]");
    }
    /**
     * Кнопка "Удалить"
     */
    public get deleteButton() : Locator {
        return Element.getElement(this.page,"//button[text()='Удалить']");
    }
    /**
     * Кнопка "Добавить группу критериев"
     */
    public get addGrpCritButton() : Locator {
        return Element.getElement(this.page,"//span[text()='Добавить группу критериев']");
    }
    /**
     * Поле "Название группы критериев"
     */
    public get grpCrit() {
        return Element.getElement(this.page,"//*[contains(@class,'groupName__placeholder')]");
    }
    /**
     * Значения выпадающего списка поля "Название группы критериев"
     */
    public get grpCritList() : Locator {
        return Element.getElement(this.page,"//*[contains(@class,'groupName__option')]");
    }
    /**
     * Созданные группы критериев
     */
    public get createdGroups() : Locator {
        return Element.getElement(this.page,"//*[contains(text(),'критерии')]");
    }
    /**
     * Поле "Выберите экспертов"
     */
    public get experts() : Locator {
        return Element.getElement(this.page,"//*[contains(@class,'experts__indicators')]");
    }
    /**
     * Значения выпадающего списка поля "Выберите экспертов"
     */
    public get expertsList() :Locator {
        return Element.getElement(this.page,"//*[contains(@class,'experts__option')]");
    }
    /**
     * Значения выпадающего списка действий
     */
    public get actionsList () : Locator {
        return Element.getElement(this.page,"//*[contains(@class,'ContextMenuLevelCanary-Item')]");
    }
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
     * Выпадающий список значений поля "Сезон"
     */
    public get seasons() : Locator {
        return Element.getElement(this.page,"//*[contains(@class,'season__option')]");
    }
    /**
     * Выпадающий список значений поля "Тип лицензий"
     */
    public get licenseTypes() : Locator {
        return Element.getElement(this.page,"//*[contains(@class,'type__option')]");
    }
    /**
     * Кнопки "Добавить" (+)
     */
    public get plusButton() : Locator {
        return Element.getElement(this.page,"//*[@class='Collapse-Side']//button[.//span[contains(@class,'IconAdd')]]");
    }
    /**
     * Поле "Номер" (критерия)
     */
    public get criteriaNumber() : Locator {
        return Element.getElement(this.page,"//input[@placeholder='Введите номер критерия']");
    }
    /**
     * Поле "Разряд"
     */
    public get rankCriteria() : Locator {
        return Element.getElement(this.page,"//*[contains(@class,'category__control')]");
    }
    /**
     * Значения выпадающего списка поля "Разряд"
     */
    public get rankList() : Locator {
        return Element.getElement(this.page,"//*[contains(@class,'category__option')]");
    }
    /**
     * Поле "Название" (критерия)
     */
    public get criteriaName() : Locator {
        return Element.getElement(this.page,"//input[@placeholder='Введите название критерия']");
    }
    /**
     * Поле "Тип критерия"
     */
    public get criteriaType() : Locator {
        return Element.getElement(this.page,"//*[contains(@class,'type__control')]");
    }
    /**
     * Значения выпадающего списка поля "Тип критерия"
     */
    public get criteriaTypeList() : Locator {
        return Element.getElement(this.page,"//*[contains(@class,'type__option')]");
    }
    /**
     * Чекбокс "Множественный критерий"
     */
    public get multi() : Locator {
        return Element.getElement(this.page,"//input[@name='isMulti']");
    }
    /**
     * Поле "Минимальное количество"
     */
    public get minCount() : Locator {
        return Element.getElement(this.page,"//input[@name='minCount']");
    }
    /**
     * Поле "Описание"
     */
    public get description() : Locator {
        return Element.getElement(this.page,"//textarea[@name='description']");
    }
    /**
     * Поле "Дополнительный тип данных"
     */
    public get additionalDataType() : Locator {
        return Element.getElement(this.page,"//*[contains(@class,'additionalDocType__control')]");
    }
    /**
     * Значения выпадающего списка поля "Дополнительный тип данных"
     */
    public get additionalDataTypeList() : Locator {
        return Element.getElement(this.page,"//*[contains(@class,'additionalDocType__option')]");
    }
    /**
     * Кнопка "Опубликовать"
     */
    public get publishButton() : Locator {
        return Element.getElement(this.page,"//button[text()='Опубликовать']");
    }
    /**
     * Кнопка "Снять с публикации"
     */
    public get unpublishButton() : Locator {
        return Element.getElement(this.page,"//button[text()='Снять с публикации']");
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
        const docsCount : number = 5;
        for(let i = 1 ; i<=docsCount ; i++) {
            switch (i) {
                case 1 : {
                    await this.docName.type(InputData.randomWord);
                    await Input.uploadFiles(this.templates);
                    break;
                }
                default : {
                    await this.addDocButton.click();
                    await this.docName.last().type(InputData.randomWord);
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
            await this.addGrpCritButton.click();
            await Element.waitForVisible(this.grpCrit);
            await this.grpCrit.click();
            groupsCount = await this.grpCritList.count();
            await this.grpCritList.first().click();
            await this.experts.click();
            await Element.waitForVisible(this.expertsList.last());
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
        await Element.waitForVisible(this.additionalDataTypeList.last());
        const dataTypeCount : number = await this.additionalDataTypeList.count();
        const randomNumb : number = randomInt(0,dataTypeCount);
        await this.additionalDataTypeList.nth(randomNumb).click();
        if (this.checkDocType(randomNumb)) {
            await Input.uploadFiles(this.templates.last());
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
        const docCount = 3;
        for(let i = 0; i < groupsCount; i++) {
            await this.fillCriteriaInfo(i);
            for(let i=0; i < docCount; i++) {
                await this.fillCriteriaDocs()
            }
            await this.saveButton.click();
        }
    }
}