/**
 * Created by BHAlrM on 8/12/2015 AD.
 */
module app {

    class ProductController {
        static $inject:string[] = ['management'];

        image:richstudio.IEditedImage;
        

        constructor(private management:richstudio.ManagementService) {
            this.activate();
        }

        public activate() {

        }

        public openImgUploadDialog() {
            this.management.openUploadDialog(this.image)
                .then((image:richstudio.IEditedImage)=> {
                    console.log(image);
                    this.image = image;
                });
        }
        
    }

    angular.module('app').controller('ProductController', ProductController);
}