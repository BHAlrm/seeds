/**
 * Created by BHAlrM on 8/12/2015 AD.
 */
module app.richstudio {

    export interface IUploadDialogScope extends ng.IScope {
        fileChange():void;
    }

    export interface IImage {
        file?:File
    }

    export class UploadDialogController {

        static $inject:string[] = ['$modalInstance', '$scope', 'management', 'request', 'notify'];

        private operatedImage:IImage;
        private isMultiFileSelection:boolean;


        constructor(private $modalInstance:ng.ui.bootstrap.IModalServiceInstance,
                    private $scope:IUploadDialogScope,
                    private management:ManagementService,
                    private request:IUploadDialogRequest,
                    private notify:ng.cgNotify.INotifyService) {
            this.activate();
        }

        public activate() {
            angular.extend(this, this.request);
        }

        public upload($files:File[], $file:File) {
            if ($files.length === 0) return;
            this.$modalInstance.close($files);
        }

        public editImage() {
            var viewDialogRequest = <IViewDialogRequest>{
                operatedImage: this.operatedImage
            };

            this.management.openViewDialog(viewDialogRequest);
        }

        public selectFormGallery() {
            var galleryDialogRequest = <IGalleryDialogRequest>{
                galleryId: '0'
            };
            this.management.openGalleryDialog(galleryDialogRequest).then((image:IImage)=>{
                this.operatedImage = image;
                this.notify({message:'selected image from gallery', classes: 'alert-danger'});
            });
        }

    }

    angular.module('app.richstudio.management').controller('UploadDialogController', UploadDialogController);
}