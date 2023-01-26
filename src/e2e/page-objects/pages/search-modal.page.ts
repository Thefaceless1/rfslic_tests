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
    public findButton : Locator = Elements.getElement(this.page,"//button[contains(@class,'SearchModal_searchBtn')]");
    /**
     * Кнопка "Выбрать" на модальном окне поиска сотрудников клуба, организаций, офи
     */
    public selectButton : Locator = Elements.getElement(this.page,"//button[text()='Выбрать']");
    /**
     * Индикатор ожидания получения записей таблицы
     */
    public loadIndicator : Locator = Elements.getElement(this.page,"//span[contains(@class,'ant-spin-dot-spin')]");
}