import {InstanceApi} from "./instance.api";

export class InfraObjectsApi extends InstanceApi {
    /**
     * Find OFI
     */
    public static findInfraObjects: string = `${this.baseUrl}/api/rest/objects/findbyparams`
}