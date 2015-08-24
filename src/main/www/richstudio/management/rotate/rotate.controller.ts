/**
 * Created by BHAlrM on 8/11/2015 AD.
 */
module richstudio {
    class RotateImageDialogController {
        static $inject:string[] = ['$modalInstance', 'image'];

        private rotateDegrees:number = 360;

        constructor(private $modalInstance:ng.ui.bootstrap.IModalServiceInstance,
                    private image:IImage) {
            this.activate();
        }

        public activate() {
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


    angular.module('richstudio.management').controller('RotateImageDialogController', RotateImageDialogController);
}
