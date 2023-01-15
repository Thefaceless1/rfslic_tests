import {RequestNewPage} from "./request-new.page.js";
import {Locator, Page} from "@playwright/test";
import {RequestSections} from "../helpers/enums/RequestSections.js";
import {Elements} from "../../framework/elements/elements.js";
import {SearchModalPage} from "./search-modal.page.js";
import {InputData} from "../helpers/input-data.js";
import {randomInt} from "crypto";
import {Pages} from "../helpers/enums/pages.js";

export class RequestPage extends RequestNewPage {
    constructor(page : Page) {
        super(page);
    }
    /**
     * Вкладки с группами критериев
     */
    private criteriaGroups : Locator = Elements.getElement(this.page,"//button[contains(text(),'критерии')]");
    /**
     * Кнопка поиска для вызова модального окна выбора сотрудников клуба, организаций, офи
     */
    private searchDataButton : Locator = Elements.getElement(this.page,"//button//span[contains(@class,'IconSearch')]");
    /**
     * Список выбранных сотрудников клуба или ОФИ или организаций
     */
    private selectedData : Locator = Elements.getElement(this.page,"//*[contains(@class,'multi-value__label')]");
    /**
     * Поле с информацией о критерии
     */
    private criteriaInfo : Locator = Elements.getElement(this.page,"//span[contains(@class,'CriteriaInfo_collapse_title')]");
    /**
     * Кнопка подтверждения статуса документа
     */
    private checkButton : Locator = Elements.getElement(this.page,"//button[.//span[contains(@class,'IconCheck')]]");
    /**
     * Поле выбора статуса документа
     */
    private docStates : Locator = Elements.getElement(this.page,"//*[contains(@class,'docState__control')]");
    /**
     * Значения выпадающего списка в поле "Решение по документу"
     */
    private docStatesList : Locator = Elements.getElement(this.page,"//*[contains(@class,'docState__option')]");
    /**
     * Выбранный статус около наименования документа
     */
    private statusNearDoc : Locator = Elements.getElement(this.page,"//*[contains(@class,'DocumentInfo')]//*[contains(@class,'Badge_view_filled')]");
    /**
     * Выбранный статус в поле "Решение по документу"
     */
    private selectedStatus : Locator = Elements.getElement(this.page,"//*[contains(@class,'docState__single-value')]");
    /**
     * Комментарий эксперта
     */
    private reviewComment : Locator = Elements.getElement(this.page,"//textarea[@name='reviewComment']");
    /**
     * Получение ячейки с наименованием пролицензии в таблице по наименованию пролицензии
     */
    private licenseRow(prolicName : string) : Locator {
        return Elements.getElement(this.page,`//td[text()='${prolicName}']`);
    }
    /**
     * Получение вкладок по enum
     */
    private sectionByEnum(section : RequestSections) : Locator {
        return Elements.getElement(this.page,`//button[text()='${section}']`);
    }
    /**
     * Открыть опубликованную лицензию
     */
    public async openPublishedLic() : Promise<void> {
        await this.goto(Pages.requestPage);
        await this.filterByProlicName();
        await this.licenseRow(this.prolicenseName).click();
    }
    /**
     * Заполнение экспертов и сотрудников клуба для групп критериев
     */
    public async addExperts() : Promise<void> {
        await this.sectionByEnum(RequestSections.criterias).click();
        await Elements.waitForVisible(this.criteriaGroups.last());
        const groupsCount = await this.criteriaGroups.count();
        for(let i = 0; i<groupsCount; i++) {
            if(i != 0) await this.criteriaGroups.nth(i).click();
            await Elements.waitForVisible(this.editButton.last());
            const editCount = await this.editButton.count();
            for(let c = 0;c<editCount; c++) {
                await this.editButton.nth(c).click();
                if(c == 0) {
                    await this.fillExperts();
                }
                else {
                    await this.fillSearchModalData();
                }
            }
        }
    }
    /**
     * Добавить экспертов к группе критериев
     */
    private async fillExperts() : Promise<void> {
        await this.experts.click();
        await Elements.waitForVisible(this.expertsList.last());
        await this.expertsList.first().click();
        await this.saveButton.click();
        await Elements.waitForHidden(this.saveButton);
    }
    /**
     * Добавить данные из модального окна поиска сотрудников клуба, организаций, офи
     */
    private async fillSearchModalData () : Promise<void> {
        const searchModal = new SearchModalPage(this.page);
        await this.searchDataButton.click();
        await searchModal.searchModalButton.click();
        await Elements.waitForHidden(searchModal.loadIndicator);
        await searchModal.checkboxTable.nth(1).check();
        await searchModal.selectButton.click();
        await Elements.waitForVisible(this.selectedData);
        await this.saveButton.click();
        await Elements.waitForHidden(this.saveButton);
    }
    /**
     * Добавить документы критериев
     */
    public async addCritDocs () : Promise<void> {
        const groupsCount = await this.criteriaGroups.count();
        for(let i = groupsCount-1; i>=0; i--) {
            await this.criteriaGroups.nth(i).click();
            await this.criteriaInfo.click();
            await Elements.waitForVisible(this.checkButton.last());
            const docsCount : number = await this.checkButton.count();
            for(let c = 0;c<docsCount; c++) {
                await this.plusButton.nth(c).click();
                await Elements.waitForVisible(this.cancelButton);
                if(await this.searchDataButton.isVisible()) {
                    await this.fillSearchModalData();
                }
                else {
                    await this.fillDocsAndComment();
                }
            }
        }
    }
    /**
     * Заполнение полей "Комментарий" и "Решение по документу"
     */
    private async fillStatusAndComment (iterationCount : number) : Promise<void> {
        for (let i = 0; i <iterationCount; i++) {
            await this.reviewComment.nth(i).type(InputData.randomWord);
            await this.docStates.nth(i).click();
            await Elements.waitForVisible(this.docStatesList.last());
            const randomStateNumb = randomInt(0,await this.docStatesList.count());
            await this.docStatesList.nth(randomStateNumb).click();
            await this.checkButton.nth(i).click()
            await this.waitForDisplayStatus(i);
        }
    }
    /**
     * Добавить комментарии и проставить статусы документам
     */
    public async addStatusAndComment () : Promise<void> {
        await this.sectionByEnum(RequestSections.generalInfo).click();
        let docsCount : number = await this.checkButton.count();
        await this.fillStatusAndComment(docsCount);
        await this.sectionByEnum(RequestSections.criterias).click();
        const groupsCount : number = await this.criteriaGroups.count();
        for(let i = 0; i<groupsCount;i++) {
            await this.criteriaGroups.nth(i).click();
            await this.criteriaInfo.click();
            await Elements.waitForVisible(this.checkButton.last());
            docsCount = await this.checkButton.count();
            await this.fillStatusAndComment(docsCount);
        }
    }
    /**
     * Ожидание обновления статуса около наименования документа в соответствии с выбранным статусом
     */
    private async waitForDisplayStatus (statusNumb : number) : Promise<void> {
        const selectedStatusText : string = await this.selectedStatus.nth(statusNumb).innerText();
        const nearDocStatusText : string = await this.statusNearDoc.nth(statusNumb).innerText();
        if (selectedStatusText.toLowerCase() != nearDocStatusText.toLowerCase()) await this.waitForDisplayStatus(statusNumb);
    }
}