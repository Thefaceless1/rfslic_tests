import {Locator} from "@playwright/test";
import {FileReader} from "../helpers/file-reader.js";
import {InputData} from "../helpers/input-data.js";

export class Input {
    /**
     * Загрузка тестовых файлов в поле с типом input
     */
    public static async uploadFiles(element : Locator) : Promise<void> {
        await element.setInputFiles(FileReader.getTestFiles);
    }
}