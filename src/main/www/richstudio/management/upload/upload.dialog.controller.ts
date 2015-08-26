/**
 * Created by BHAlrM on 8/12/2015 AD.
 */
module richstudio {

    export interface IUploadDialogScope extends ng.IScope {
        fileChange():void;
    }
    
    export interface IImage{
        file?:File
    }
    
    export class UploadDialogController {
        
        static $inject:string[] = ['$modalInstance', '$scope', 'management', 'request'];
        
        private operatedImage:IImage;
        private isMultiFileSelection:boolean;
        
        
        constructor(private $modalInstance:ng.ui.bootstrap.IModalServiceInstance,
                    private $scope:IUploadDialogScope,
                    private management:ManagementService,
                    private request:IUploadDialogRequest) {
            this.activate();
        }

        public activate() {
            angular.extend(this, this.request);
        }

        public upload($files:File[], $file:File) {
            if($files.length === 0) return;
            this.$modalInstance.close($files);
        }

        public editImage() {
            var viewDialogRequest = <IViewDialogRequest>{
                operatedImage: this.operatedImage
            };
            
            this.management.openViewDialog(viewDialogRequest);
        }

        public selectFormGallery() {
            this.$modalInstance.close('select');
        }

    }

    angular.module('richstudio.management').controller('UploadDialogController', UploadDialogController);
}