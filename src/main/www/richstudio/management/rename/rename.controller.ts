/**
 * Created by BHAlrM on 8/11/2015 AD.
 */
module richstudio {
    class RenameImageDialogController {
        static $inject:string[] = ['$modalInstance', 'image'];

        private name:string;

        constructor(private $modalInstance:ng.ui.bootstrap.IModalServiceInstance,
                    private image:IImage) {
            this.activate();
        }

        public activate() {
            this.name = angular.copy(this.image.image_title);
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
