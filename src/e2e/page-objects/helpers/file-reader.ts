import * as fs from "fs";

export class FileReader {
    private static readonly path : string = "src/e2e/page-objects/helpers/testfiles/";
    /**
     * Get an array of test files with relative paths
     */
    public static get getTestFiles () {
        const fileNames : string[] = fs.readdirSync(this.path);
        return fileNames.map(value => this.path+value);
    }
}