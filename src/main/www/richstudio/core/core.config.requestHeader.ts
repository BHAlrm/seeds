/**
 * Created by BHAlrM on 8/7/2015 AD.
 */

module richstudio {

    class RequestHeaderConfig {

        constructor() {
            XMLHttpRequest.prototype.setRequestHeader = (function (sup:Function) {
                return function (header:string, value:any) {
                    if ((header === "__XHR__") && angular.isFunction(value))
                        value(this);
                    else
                        sup.apply(this, arguments);
                };
            })(XMLHttpRequest.prototype.setRequestHeader);
        }

    }

    angular.module('richstudio.core')
        .config(RequestHeaderConfig);

}