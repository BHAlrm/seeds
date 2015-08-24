/**
 * Created by BHAlrM on 8/23/2015 AD.
 */
module richstudio {

    export class UploaderDialogController {
        static $inject:string[] = ['$modalInstance', 'RichStudioDataService', 'uploadRequest', '$scope'];
        progressPercentage:number;

        constructor(private $modalInstance:ng.ui.bootstrap.IModalServiceInstance,
                    private dataService:RichStudioDataService,
                    private uploadRequest:any,
                    private $scope:ng.IScope) {

            if(this.uploadRequest.image){
                this.dataService.uploadImage(this.uploadRequest, (e:ProgressEvent)=> {
                    $scope.$apply(()=>{
                        this.progressPercentage = 100.0 * e.loaded / e.total;
                    });
                }).then(()=>{
                    $modalInstance.close();
                });
            }else{
                this.dataService.uploadImageToGallery(this.uploadRequest, (e:ProgressEvent)=> {
                    $scope.$apply(()=>{
                        this.progressPercentage = 100.0 * e.loaded / e.total;
                    });
                }).then(()=>{
                    $modalInstance.close();
                });
            }
            
        }


    }

    angular.module('richstudio.management').controller('UploaderDialogController', UploaderDialogController);

}