import {BasePage} from "./base.page.js";
import {Locator, Page} from "@playwright/test";
import {ConstructorNewPage} from "./constructor-new.page.js";
import {Elements} from "../../framework/elements/elements.js";
import {Input} from "../../framework/elements/input.js";
import {InputData} from "../helpers/input-data.js";

export class RequestNewPage extends BasePage {
    public prolicenseName : string
    public readonly newRequestUrl : string = "/#/request_new"
    constructor(page : Page) {
        super(page);
        this.prolicenseName = ''
    }
    /**
     * Кнопка "->" в левом углу таблицы
     */
    public arrow  : Locator = Elements.getElement(this.page,"(//td[contains(@class,'fix-left')]/button)[1]");

    /**
     * Кнопка "Перейти к заявке"
     */
    public goToRequest : Locator = Elements.getElement(this.page,"//span[text()='Перейти к заявке']");

    /**
     * Текстовое поле "Комментарий"
     */
    public comment : Locator = Elements.getElement(this.page,"//textarea[@name='comment']")

    /**
     * Кнопка "Добавить"
     */
    public addButton : Locator = Elements.getElement(this.page,"//button[text()='Добавить']");

    /**
     * Кнопка "Подать заявку"
     */
    public publishReqButton : Locator = Elements.getElement(this.page,"//button[text()='Подать заявку']");

    /**
     * Создание пролицензии с заполненными группами критериев и критериями
     */
    public async createTestProlicense() : Promise<void> {
        const constructor = new ConstructorNewPage(this.page);
        await constructor.goto(constructor.url);
        await constructor.createProlicense();
        await constructor.createGrpCrit();
        await constructor.createCriteria();
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
    public async createDraft() : Promise<void> {
        await this.arrow.click();
        await this.goToRequest.click();
    }
    /**
     * Подача заявки
     */
    public async publishLic(): Promise<void> {
        await Elements.waitForVisible(this.plusButton.last());
        const iterationCount : number = await this.plusButton.count();
        for(let i = 0; i<iterationCount; i++) {
            await this.plusButton.nth(i).click();
            await Input.uploadFiles(this.templates);
            await Elements.waitForVisible(this.docIcon);
            await Elements.waitForVisible(this.xlsxIcon);
            await this.comment.type(InputData.randomWord);
            await this.addButton.click();
        }
        await this.publishReqButton.click();
    }
    /**
     * Создание тестовой поданной заявки для дальнейших действий с ней
     */
    public async createTestLic() : Promise<void> {
        await this.goto(this.newRequestUrl);
        await this.filterByProlicName();
        await this.createDraft();
        await this.publishLic();
    }
}