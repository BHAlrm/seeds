/**
 * Created by BHAlrM on 8/11/2015 AD.
 */
module richstudio {
    class RenameImageDialogController {
        static $inject:string[] = ['$modalInstance', 'request'];

        private operatedImage:IImage;
        private imageList:IImage[];
        private name:string;

        constructor(private $modalInstance:ng.ui.bootstrap.IModalServiceInstance,
                    private request:IImageManagementDialogRequest) {
            this.activate();
        }

        public activate() {
            angular.extend(this, this.request);
            this.name = angular.copy(this.operatedImage.image_title);
        }

        public resolve() {
            this.$modalInstance.close(this.name);
        }

        public dismiss() {
            this.$modalInstance.dismiss();
        }

        

    }


    angular.module('richstudio.management').controller('RenameImageDialogController', RenameImageDialogController);
}
