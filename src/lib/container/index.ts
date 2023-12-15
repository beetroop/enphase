import {container} from 'tsyringe';
import {httpService} from "../services/httpService"
import {enphaseLocalAPI} from "../services/enphaseLocalAPI";

container.registerSingleton("httpService", httpService);
container.registerSingleton("enphaseLocalAPI", enphaseLocalAPI);


export {container, httpService, enphaseLocalAPI}
