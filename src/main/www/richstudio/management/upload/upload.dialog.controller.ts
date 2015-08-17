/**
 * Created by BHAlrM on 8/12/2015 AD.
 */
module richstudio {

    export interface IUploadDialogScope extends ng.IScope {
        fileChange():void;
    }

    export class UploadDialogController {
        static $inject:string[] = ['$modalInstance', '$scope', 'image'];
        constructor(private $modalInstance:ng.ui.bootstrap.IModalServiceInstance,
                    private $scope:IUploadDialogScope,
                    private image:IEditedImage) {
            this.activate();
        }

        public activate() {


        }

        public upload($files:File[], $file:File, $event:Event, $rejectedFiles:File) {
            if(!$file) return;
            
            var fr = new FileReader();
            fr.onload = (e:any)=> {
                this.$scope.$apply(() => {
                    this.image.image_file = e.target.result;
                });
            };
            
            fr.readAsDataURL(this.image.image_file);
        }

        public editImage() {
            this.$modalInstance.close({action: eUploadAction.EDIT, image:this.image});
        }

        public selectFormGallery() {
            this.$modalInstance.close('select');
        }

    }

    angular.module('richstudio.management').controller('UploadDialogController', UploadDialogController);
}