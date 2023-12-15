import "reflect-metadata";
import { Command } from "commander";
import { enphaseLocalAPI, container } from "./lib/container";
import {enphaseRemoteAPI} from "./lib/services/enphaseRemoteAPI";

const program = new Command();
const localAPI: enphaseLocalAPI = container.resolve("enphaseLocalAPI");
const remoteAPI: enphaseRemoteAPI = container.resolve("enphaseRemoteAPI");

const main = async () => {
    console.log(await localAPI.ping() ? "Local API is up" : "Local API is down");
    console.log(await remoteAPI.ping() ? "Remote API is up" : "Remote API is down");
}

program
    .version("1.0.0")
    .description("Enphase Envoy API CLI");

main().then(()=>console.log('done'));