import 'dotenv/config'
import * as Process from "process";
import postgres from "postgres";

export const dbConfig: postgres.Options<any> = {
    host : Process.env.DB_HOST,
    port : Number(Process.env.DB_PORT),
    database : Process.env.DB_NAME,
    username : Process.env.DB_USER,
    password : Process.env.DB_PASS
}