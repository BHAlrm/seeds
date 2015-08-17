/**
 * Created by BHAlrM on 8/11/2015 AD.
 */
module richstudio {
    class ViewImageDialogController {
        static $inject:string[] = ['$modalInstance', 'image'];

        isRotate = false;
        isCrop = false;
        resultImage:File = null;
        tempImage:File = null;

        constructor(private $modalInstance:ng.ui.bootstrap.IModalServiceInstance,
                    private image:IEditedImage) {
            this.tempImage = angular.copy(image.image_file);
        }

        public resolve() {
            this.$modalInstance.close(this.image);
        }

        public dismiss() {
            this.$modalInstance.dismiss();
        }

        public rename() {

        }

        public rotate() {
            this.isRotate = !this.isRotate;
        }

        public crop() {
            this.isCrop = !this.isCrop;
            if(this.isCrop){
                this.image.image_file = angular.copy(this.tempImage);
            }else{
                this.image.image_file = angular.copy(this.resultImage);
            }
        }

        public delete() {

        }

        public rotating(degrees:number) {
            this.image.txt_rotate_degree =( (this.image.txt_rotate_degree || 0) + degrees) % 360;
        }
    }


    angular.module('richstudio.management').controller('ViewImageDialogController', ViewImageDialogController);
}
