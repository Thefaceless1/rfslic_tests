import * as fs from "fs";
import path from "path";
import { fileURLToPath} from "url";

export class FileReader {
    /**
     * Get an array of test files with relative paths
     */
    public static get getTestFiles() {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const testFilesPath: string = path.resolve(__dirname, "testfiles");
        const fileNames: string[] = fs.readdirSync(testFilesPath);
        return fileNames.map(fileName => {
            const obj = {
                dir: testFilesPath,
                base: fileName
            }
            return path.format(obj);
        });
    }
}