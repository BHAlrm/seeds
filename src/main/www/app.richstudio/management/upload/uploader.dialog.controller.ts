/**
 * Created by BHAlrM on 8/23/2015 AD.
 */
module app.richstudio {

    export class UploaderDialogController {
        static $inject:string[] = ['$modalInstance', 'RichStudioDataService', 'uploadRequest', '$scope', 'notify'];
        progressPercentage:string;

        constructor(private $modalInstance:ng.ui.bootstrap.IModalServiceInstance,
                    private dataService:RichStudioDataService,
                    private uploadRequest:any,
                    private $scope:ng.IScope,
                    private notify:ng.cgNotify.INotifyService) {


            if (this.uploadRequest.image_file) {

                this.dataService.uploadImage(this.uploadRequest, this.uploadFn).then(()=> {
                    this.notify({message: 'successfully uploaded.', classes: 'alert alert-success'});
                    $modalInstance.close();
                });
            } else {

                this.dataService.uploadImageToGallery(this.uploadRequest, this.uploadFn).then(()=> {
                    this.notify({message: 'successfully uploaded.', classes: 'alert alert-success'});
                    $modalInstance.close();
                });
            }

        }

        uploadFn = ()=> {
            return (xhr:XMLHttpRequest)=> {
                xhr.upload.addEventListener("onprogress", (event:ProgressEvent) => {
                    this.$scope.$apply(()=> {
                        this.progressPercentage = ((event.loaded/event.total) * 100) + "%";
                    });
                });

                xhr.upload.onprogress = (event:ProgressEvent) => {
                    this.$scope.$apply(()=> {
                        this.progressPercentage = ((event.loaded/event.total) * 100) + "%";
                    });
                };
            }
        };

    }
    angular.module('app.richstudio.management').controller('UploaderDialogController', UploaderDialogController);

}