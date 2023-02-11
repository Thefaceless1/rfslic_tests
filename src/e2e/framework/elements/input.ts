import {Locator} from "@playwright/test";
import {FileReader} from "../../page-objects/helpers/file-reader.js";
import {Elements} from "./elements.js";

export class Input extends Elements{
    /**
     * Load test files in a field with type "input"
     */
    public static async uploadFiles(element : Locator) : Promise<void> {
        await element.setInputFiles(FileReader.getTestFiles);
    }
}