import {Locator, Page} from "@playwright/test";
import {ConstructorNewPage} from "./constructor-new.page.js";
import {Elements} from "../../framework/elements/elements.js";
import {Pages} from "../helpers/enums/pages.js";
import {Columns} from "../helpers/enums/columns.js";
import {Input} from "../../framework/elements/input.js";
import {InputData} from "../helpers/input-data.js";
import {MainPage} from "./main.page.js";

export class RequestNewPage extends MainPage {
    public prolicenseName : string
    constructor(page : Page) {
        super(page);
        this.prolicenseName = ''
    }
    /**
     * Кнопка "->" в левом углу таблицы
     */
    private arrow  : Locator = Elements.getElement(this.page,"(//td[contains(@class,'fix-left')]/button)[1]");

    /**
     * Кнопка "Перейти к заявке"
     */
    private goToRequest : Locator = Elements.getElement(this.page,"//span[text()='Перейти к заявке']");
    /**
     * Кнопка "Подать заявку"
     */
    private publishReqButton : Locator = Elements.getElement(this.page,"//button[text()='Подать заявку']");
    /**
     * Поле "Выберите клуб"
     */
    private selectClub : Locator = Elements.getElement(this.page,"//*[contains(@class,'club__control')]");
    /**
     * Выпадающий список значений поля "Выберите клуб"
     */
    private selectClubList : Locator = Elements.getElement(this.page,"//*[contains(@class,'club__option')]");
    /**
     * Заголовок страницы "Заявка на лицензирование клуба"
     */
    public requestTitle : Locator = Elements.getElement(this.page,"//*[text()='Заявка на лицензирование клуба']");
    /**
     * Выбрать клуб из выпадающего списка значений
     */
    public async chooseClub() : Promise<void> {
        await Elements.waitForVisible(this.selectClub);
        await this.selectClub.click();
        await Elements.waitForVisible(this.selectClubList.first());
        await this.selectClubList.first().click();
    }
    /**
     * Создание пролицензии с заполненными группами критериев и критериями
     */
    public async createTestProlicense() : Promise<void> {
        const constructor = new ConstructorNewPage(this.page);
        await constructor.openConstructor();
        await constructor.createProlicense();
        await Elements.waitForVisible(constructor.createdProlicName);
        this.prolicenseName = await constructor.createdProlicName.innerText();
        await constructor.createGrpCrit();
        await constructor.createCriteria();
        await constructor.publishProlicense();
        await constructor.page.waitForNavigation({url : Pages.constructorPage,waitUntil : "load"});
    }
    /**
     * Установить в таблице фильтр по заданному столбцу
     */
    public async filterByColumn(column : Locator) : Promise<void> {
        await column.click();
        await this.searchInput.type(this.prolicenseName);
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
            await this.fillDocsAndComment();
        }
        await this.publishReqButton.click();
    }
    /**
     * Создание тестовой поданной заявки для дальнейших действий с ней
     */
    public async createTestLic() : Promise<void> {
        await this.goto(Pages.requestNewPage);
        await this.chooseClub();
        await this.filterByColumn(this.filterButtonByEnum(Columns.licName));
        await this.createDraft();
        await this.publishLic();
    }
    /**
     * Добавить файлы и комментарии для документов лицензии
     */
    protected async fillDocsAndComment () : Promise<void> {
        await Input.uploadFiles(this.templates.first());
        await Elements.waitForVisible(this.docIcon);
        await Elements.waitForVisible(this.xlsxIcon);
        await this.comment.type(InputData.randomWord);
        await this.addButton.click();
    }
}