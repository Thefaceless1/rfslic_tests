import {PlaywrightDevPage} from "../../framework/helpers/playwright-dev-page.js";
import {Locator, Page} from "@playwright/test";
import {Elements} from "../../framework/elements/elements.js";
import {Notifications} from "../helpers/enums/notifications.js";

export class BasePage extends PlaywrightDevPage{
    constructor(page : Page) {
        super(page);
    }
    /**
     * Кнопка "Добавить" (+)
     */
    public plusButton : Locator = Elements.getElement(this.page,"//button[contains(@class,'Button_view_secondary')][.//span[contains(@class,'IconAdd')]]");

    /**
     * Кнопка "Сохранить"
     */
    public saveButton = Elements.getElement(this.page,"//button[text()='Сохранить']");

    /**
     * Кнопка "Добавить" (карандаш)
     */
    public editButton : Locator = Elements.getElement(this.page,"//button[contains(@class,'Button_view_secondary')][.//span[contains(@class,'IconEdit')]]");

    /**
     * Поле "Выберите экспертов"
     */
    public experts : Locator = Elements.getElement(this.page,"//*[contains(@class,'experts__indicators')]");

    /**
     * Значения выпадающего списка поля "Выберите экспертов"
     */
    public expertsList :Locator = Elements.getElement(this.page,"//*[contains(@class,'experts__option')]");

    /**
     * Поле "Шаблоны документов"
     */
    public templates : Locator = Elements.getElement(this.page,"//input[@type='file']");

    /**
     * Иконка загруженного doc файла
     */
    public docIcon : Locator = Elements.getElement(this.page,"//*[contains(@class,'FileIconDoc')]");

    /**
     * Иконка загруженного xlsx файла
     */
    public xlsxIcon : Locator = Elements.getElement(this.page,"//*[contains(@class,'FileIconXls')]");

    /**
     * Список текущих уведомлений на экране
     */
    public notifications : Locator = Elements.getElement(this.page,"//div[contains(@class,'notice-message')]");
    /**
     * Поле ввода значения в фильтре поля "Название пролицензии"
     */
    public prolicNameSearchInput : Locator = Elements.getElement(this.page,"//input[contains(@class,'Table_filterElement')]");

    /**
     * Кнопки "Фильтр" в поле "Наименование"(пролицензии)
     */
    public prolicFilterButton : Locator = Elements.getElement(this.page,"//span[contains(text(),'Название')]//following-sibling::span");

    /**
     * Кнопка "Найти" в фильтре столбца таблицы
     */
    public searchButton : Locator = Elements.getElement(this.page,"//span[text()='Найти']");
    /**
     * Получение уведомления по enum
     */
    public notifyByEnum (enumValue : Notifications) : Locator {
        return this.notifications.filter({hasText : enumValue});
    }
}