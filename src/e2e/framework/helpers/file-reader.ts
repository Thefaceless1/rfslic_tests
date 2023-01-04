import * as fs from "fs";

export class FileReader {
    private static readonly path : string = "src/e2e/framework/helpers/testfiles/";
    /**
     * Получение массива тестовых файлов с относительными путями
     */
    public static get getTestFiles () {
        const fileNames : string[] = fs.readdirSync(this.path);
        return fileNames.map(value => this.path+value);
    }
}