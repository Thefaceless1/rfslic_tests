import {BasePage} from "./base-page.js";
import {Page} from "@playwright/test";
import {ConstructorNewPage} from "./constructor-new-page.js";

export class RequestNewPage extends BasePage {
    private prolicenseName : string
    public readonly url : string = "/#/request_new"
    constructor(page : Page) {
        super(page);
        this.prolicenseName = ''
    }
    /**
     * Создание пролицензии с заполненными группами критериев и критериями
     */
    public async createTestProlicense() : Promise<void> {
        const constructor = new ConstructorNewPage(this.page);
        await constructor.goto(constructor.url);
        await constructor.createProlicense();
        //await constructor.createGrpCrit();
        //await constructor.createCriteria();
        await constructor.publishProlicense();
        this.prolicenseName = await constructor.createdProlicName.innerText();
    }
    /**
     * Установить в таблице фильтр по наименованию созданной пролицензии
     */
    public async filterByProlicName() : Promise<void> {
        await this.prolicFilterButton.click();
        await this.prolicNameSearchInput.type(this.prolicenseName);
        await this.searchButton.click();
    }
    /**
     * Создать заявку в статусе "Черновик"
     */
    public async createDraft() {

    }
}