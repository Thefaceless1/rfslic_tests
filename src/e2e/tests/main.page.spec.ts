import {expect, test} from "@playwright/test";
import {MainPage} from "../page-objects/pages/main.page.js";
import {Pages} from "../page-objects/helpers/enums/pages.js";
import {MainMenuOptions} from "../page-objects/helpers/enums/main-menu-options.js";

test.describe("Главная страница", () => {
    test.beforeEach(async ({page}) => {
        const main = new MainPage(page);
        await main.goto(Pages.mainPage);
    })
    test("Переход на страницу 'Конструктор пролицензий' ", async ({page}) => {
        const main = new MainPage(page);
        await main.clickOnMenuOption(MainMenuOptions.constructor);
        expect(main.currentUrl).toBe(Pages.constructorPage);
    })
    test("Переход на страницу 'Подача заявки' ", async ({page}) => {
        const main = new MainPage(page);
        await main.clickOnMenuOption(MainMenuOptions.sendRequest);
        expect(main.currentUrl).toBe(Pages.requestNewPage);
    })
    test("Переход на страницу 'Работа с заявками' ", async ({page}) => {
        const main = new MainPage(page);
        await main.clickOnMenuOption(MainMenuOptions.workWithRequest);
        expect(main.currentUrl).toBe(Pages.requestPage);
    })
})