import {PlaywrightDevPage} from "../../framework/helpers/playwright-dev-page.js";
import {Locator, Page} from "@playwright/test";
import {Elements} from "../../framework/elements/elements.js";
import {Notifications} from "../helpers/enums/notifications.js";
import {Columns} from "../helpers/enums/columns.js";

export class BasePage extends PlaywrightDevPage{
    constructor(page : Page) {
        super(page);
    }
    /**
     * Кнопка "Добавить" (+)
     */
    protected plusButton : Locator = Elements.getElement(this.page,"//button[contains(@class,'Button_view_secondary')][.//span[contains(@class,'IconAdd')]]");
    /**
     * Кнопка "Сохранить"
     */
    protected saveButton = Elements.getElement(this.page,"//button[text()='Сохранить']");
    /**
     * Кнопка "Удалить"
     */
    protected deleteButton = Elements.getElement(this.page,"//button[text()='Удалить']");
    /**
     * Кнопка "Отменить"
     */
    protected cancelButton = Elements.getElement(this.page,"//button[text()='Отменить']");
    /**
     * Кнопка "Редактировать" (карандаш)
     */
    protected editButton : Locator = Elements.getElement(this.page,"//button[contains(@class,'Button_view_secondary')][.//span[contains(@class,'IconEdit')]]");
    /**
     * Поле "Выберите экспертов"
     */
    protected experts : Locator = Elements.getElement(this.page,"//*[contains(@class,'experts__indicators')]");
    /**
     * Значения выпадающего списка поля "Выберите экспертов"
     */
    protected expertsList :Locator = Elements.getElement(this.page,"//*[contains(@class,'experts__option')]");
    /**
     * Поле "Шаблоны документов"
     */
    protected templates : Locator = Elements.getElement(this.page,"//input[@type='file']");
    /**
     * Иконка загруженного doc файла
     */
    protected docIcon : Locator = Elements.getElement(this.page,"//*[contains(@class,'FileIconDoc')]");
    /**
     * Иконка загруженного xlsx файла
     */
    protected xlsxIcon : Locator = Elements.getElement(this.page,"//*[contains(@class,'FileIconXls')]");
    /**
     * Список текущих уведомлений на экране
     */
    protected notifications : Locator = Elements.getElement(this.page,"//div[contains(@class,'notice-message')]");
    /**
     * Поле ввода значения в фильтре поля "Название пролицензии"
     */
    protected searchInput : Locator = Elements.getElement(this.page,"//input[contains(@class,'Table_filterElement')]");
    /**
     * Кнопка "Найти" в фильтре столбца таблицы
     */
    protected searchButton : Locator = Elements.getElement(this.page,"//span[text()='Найти']");
    /**
     * Текстовое поле "Комментарий"
     */
    protected comment : Locator = Elements.getElement(this.page,"//textarea[@name='comment']")
    /**
     * Кнопка "Добавить"
     */
    protected addButton : Locator = Elements.getElement(this.page,"//button[text()='Добавить']");
    /**
     * Чекбоксы
     */
    public checkbox : Locator = Elements.getElement(this.page,"//input[@type='checkbox']");
    /**
     * Кнопка поиска для вызова модального окна выбора сотрудников клуба, организаций, офи
     */
    protected searchDataButton : Locator = Elements.getElement(this.page,"//button//span[contains(@class,'IconSearch')]");
    /**
     * Получение уведомления по enum
     */
    public notifyByEnum (enumValue : Notifications) : Locator {
        return this.notifications.filter({hasText : enumValue});
    }
    /**
     * Получить кнопку "Фильтр" по названию столбца таблиц
     */
    public filterButtonByEnum(columnValue : Columns) : Locator {
        return Elements.getElement(this.page,`//span[contains(text(),'${columnValue}')]//following-sibling::span`);
    }
}