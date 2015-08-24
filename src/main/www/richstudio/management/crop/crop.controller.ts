/**
 * Created by BHAlrM on 8/11/2015 AD.
 */
module richstudio {
    export interface ICropRect{
        cx: number,
        cy: number,
        cw?: number,
        ch?: number,
        width?: number,
        height?: number,
        rect_size?: number
    }
    
    class CropImageDialogController {
        static $inject:string[] = ['$modalInstance', 'image'];
        
        cropRect:ICropRect;

        constructor(private $modalInstance:ng.ui.bootstrap.IModalServiceInstance,
                    private image:IImage) {
        }

        public resolve() {
            this.$modalInstance.close(this.cropRect);
        }

        public dismiss() {
            this.$modalInstance.dismiss();
        }

    }


    angular.module('richstudio.management').controller('CropImageDialogController', CropImageDialogController);
}
