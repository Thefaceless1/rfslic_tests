import fs from "fs";

export class FileReader {
    public static readonly fileDir : string ="src/api/helpers/testfiles/";
    /**
     * Наименования тестовых файлов
     */
    public static get fileNames() : string[] {
        return fs.readdirSync(this.fileDir);
    }
}