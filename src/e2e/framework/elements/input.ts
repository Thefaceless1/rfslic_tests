import {Locator} from "@playwright/test";
import {FileReader} from "../../page-objects/helpers/file-reader.js";
import {Elements} from "./elements.js";

export class Input extends Elements{
    /**
     * Загрузка тестовых файлов в поле с типом input
     */
    public static async uploadFiles(element : Locator) : Promise<void> {
        await element.setInputFiles(FileReader.getTestFiles);
    }
}