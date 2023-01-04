import {Locator} from "@playwright/test";
import {FileReader} from "../helpers/file-reader.js";
import {InputData} from "../helpers/input-data.js";

export class Input {
    /**
     * Заполнение поля с типом input
     */
    public static async fillInput(element : Locator) : Promise<void> {
        await element.type(InputData.getRandomWord);
    }
    /**
     * Загрузка файлов в поле с типом input
     */
    public static async uploadFiles(element : Locator) : Promise<void> {
        await element.setInputFiles(FileReader.getTestFiles);
    }
}