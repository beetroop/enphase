import "reflect-metadata";
import { Command } from "commander";
import { enphaseLocalAPI, container } from "./lib/container";
import env from "dotenv";

env.config();

const program = new Command();
const localAPI: enphaseLocalAPI = container.resolve("enphaseLocalAPI");

const main = async () => {
    console.log(await localAPI.getLocalData("/api/v1/production"));
}

program
    .version("1.0.0")
    .description("Enphase Envoy API CLI");

main().then(()=>console.log('done'));