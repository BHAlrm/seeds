/**
 * Created by BHAlrM on 8/9/2015 AD.
 */

module app.richstudio {

    export interface IApi {
        GALLERY: string;
        IMAGE: string;
    }
    
    angular.module('app.richstudio.core')
        .constant('API', <IApi>{
            GALLERY: "http://128.199.139.181/gae/storeconsole_api/v1/imagegallery",
            IMAGE: "http://128.199.139.181/gae/storeconsole_api/v1/image"
        });
}