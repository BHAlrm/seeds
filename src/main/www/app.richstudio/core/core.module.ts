/**
 * Created by BHAlrM on 8/7/2015 AD.
 */

module app.richstudio {

    angular
        .module('app.richstudio.core', ['ui.bootstrap', 'ngFileUpload', 'cgNotify'])
        .config(config)
    ;

    function config(){
        XMLHttpRequest.prototype.setRequestHeader = (function(sup:any) {
            return function(header:string, value:any) {
                if ((header === "__setXHR_") && angular.isFunction(value))
                    value(this);
                else
                    sup.apply(this, arguments);
            };
        })(XMLHttpRequest.prototype.setRequestHeader);
    }

}