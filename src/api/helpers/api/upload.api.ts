import {InstanceApi} from "./instance.api";

export class UploadApi extends InstanceApi {
    /**
     * Upload files
     */
    public static uploadFiles: string = `${this.baseUrl}/api/rest/uploadFile`
}