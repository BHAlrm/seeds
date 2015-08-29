/**
 * Created by BHAlrM on 8/11/2015 AD.
 */
module app.richstudio {
    class RotateImageDialogController {
        static $inject:string[] = ['$modalInstance', 'request'];

        private operatedImage:IImage;
        private imageList:IImage[];
        private rotateDegrees:number = 360;

        constructor(private $modalInstance:ng.ui.bootstrap.IModalServiceInstance,
                    private request:IImageManagementDialogRequest) {
            this.activate();
        }

        public activate() {
            angular.extend(this, this.request);
        }

        public resolve() {
            this.$modalInstance.close(this.rotateDegrees);
        }

        public dismiss() {
            this.$modalInstance.dismiss();
        }

        public rotate(degrees:number){
            this.rotateDegrees = (this.rotateDegrees + degrees) % 360;
        }

    }


    angular.module('app.richstudio.management').controller('RotateImageDialogController', RotateImageDialogController);
}
