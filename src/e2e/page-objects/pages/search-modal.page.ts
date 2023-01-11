import {BasePage} from "./base.page.js";
import {Locator, Page} from "@playwright/test";
import {Elements} from "../../framework/elements/elements.js";

export class SearchModalPage extends BasePage {
    constructor(page : Page) {
        super(page);
    }
    /**
     * Кнопка поиска на модальном окне поиска сотрудников клуба, организаций, офи
     */
    public searchModalButton : Locator = Elements.getElement(this.page,"//button[contains(@class,'SearchModal_searchBtn')]");

    /**
     * Чекбоксы строк таблицы найденных значений на модальном окне поиска сотрудников клуба, организаций, офи
     */
    public checkboxTable : Locator = Elements.getElement(this.page,"//input[@type='checkbox']");

    /**
     * Кнопка "Выбрать" на модальном окне поиска сотрудников клуба, организаций, офи
     */
    public selectButton : Locator = Elements.getElement(this.page,"//button[text()='Выбрать']");
    /**
     * Индикатор ожидания получения записей таблицы
     */
    public loadIndicator : Locator = Elements.getElement(this.page,"//span[contains(@class,'ant-spin-dot-spin')]");
    /**
     * Количество одновременно отображаемых строк в таблице
     */
    public async countRowsInTable () : Promise<number> {
        const ews = await Elements.getElement(this.page,"(//span[contains(@class,'selection-item')])[1]");
        return  ews.innerText().then(value => parseInt(value));
    }
}