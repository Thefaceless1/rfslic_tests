import log4js from "log4js";
import path from "path";

export const logsFileName: string = "rfslic.log"
export const logsFilePath: string = path.resolve("src","e2e","artifacts","logs",`${logsFileName}`);
export const config: log4js.Configuration = {
    appenders: {
        file: {
            type: "file",
            filename: logsFilePath,
            flags: "w"
        }
    },
    categories: {
        default: {
            appenders: ["file"],
            level: "info"
        }
    }
}