import {RequestNewPage} from "./request-new.page.js";
import {Locator, Page} from "@playwright/test";
import {RequestSections} from "../helpers/enums/RequestSections.js";
import {Elements} from "../../framework/elements/elements.js";
import {SearchModalPage} from "./search-modal.page.js";

export class RequestPage extends RequestNewPage {
    public readonly requestUrl : string = "/#/request"
    constructor(page : Page) {
        super(page);
    }
    /**
     * Вкладки с группами критериев
     */
    public criteriaGroups : Locator = Elements.getElement(this.page,"//button[contains(text(),'критерии')]");

    /**
     * Кнопка поиска для вызова модального окна выбора сотрудников клуба, организаций, офи
     */
    public searchDataButton : Locator = Elements.getElement(this.page,"//button//span[contains(@class,'IconSearch')]");

    /**
     * Список выбранных сотрудников клуба для группы критериев
     */
    public selectedWorkers : Locator = Elements.getElement(this.page,"//*[contains(@class,'experts__multi-value__label')]");
    /**
     * Получение ячейки с наименованием пролицензии в таблице по наименованию пролицензии
     */
    public licenseRow(prolicName : string) : Locator {
        return Elements.getElement(this.page,`//td[text()='${prolicName}']`);
    }
    /**
     * Получение вкладок по enum
     */
    public sectionByEnum(section : RequestSections) : Locator {
        return Elements.getElement(this.page,`//button[text()='${section}']`);
    }
    /**
     * Открыть опубликованную лицензию
     */
    public async openPublishedLic() : Promise<void> {
        await this.goto(this.requestUrl);
        await this.filterByProlicName();
        await this.licenseRow(this.prolicenseName).click();
    }
    /**
     * Заполнение экспертов и сотрудников клуба для групп критериев
     */
    public async fillExperts() : Promise<void> {
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
                    await this.addExperts();
                }
                else {
                    await this.addSearchModalData();
                }
            }
        }
        await this.page.pause();
    }
    /**
     * Добавить экспертов к группе критериев
     */
    public async addExperts() : Promise<void> {
        await this.experts.click();
        await Elements.waitForVisible(this.expertsList.last());
        await this.expertsList.first().click();
        await this.saveButton.click();
        await Elements.waitForHidden(this.saveButton);
    }
    /**
     * Добавить данные из модального окна поиска сотрудников клуба, организаций, офи
     */
    public async addSearchModalData () : Promise<void> {
        const searchModal = new SearchModalPage(this.page);
        await this.searchDataButton.click();
        await searchModal.searchModalButton.click();
        await Elements.waitForHidden(searchModal.loadIndicator);
        await searchModal.checkboxTable.first().check();
        await searchModal.selectButton.click();
        await Elements.waitForVisible(this.selectedWorkers.last());
        await this.saveButton.click();
        await Elements.waitForHidden(this.saveButton);
    }
}