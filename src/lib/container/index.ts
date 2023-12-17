import {container} from 'tsyringe';
import {httpClientFactory, httpClient} from "../services/httpClient"
import {enphaseLocalAPI} from "../services/enphaseLocalAPI";

container.registerSingleton("enphaseLocalAPI", enphaseLocalAPI);
export {container, httpClientFactory, httpClient ,enphaseLocalAPI}