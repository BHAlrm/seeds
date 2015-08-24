/**
 * Created by BHAlrM on 8/12/2015 AD.
 */
module app {

    class ProductController {
        static $inject:string[] = ['management'];

        image:richstudio.IImage;
        cropRect:richstudio.ICropRect;
        rotateDegree:number;

        constructor(private management:richstudio.ManagementService) {
            this.activate();
        }

        public activate() {
            this.image = {
                image_id: '-1',
                image_url: 'http://placehold.it/350x150'
            };
        }

        public openImgUploadDialog() {
            this.management.openUploadDialog(this.image)
                .then((files:File[])=>{
                    var fr = new FileReader();
                    fr.readAsDataURL(files[0]);
                    fr.onload = (e:Event)=> {
                        var fileReader = <FileReader>e.target;
                        this.image.image_url = fileReader.result;
                        this.image.file = files[0];
                    };
                });
        }
        
        public submit(){
            this.management.uploadImage(this.image, this.cropRect, this.rotateDegree).then(()=>{
                //alert('successfully upload image');
            });
        }

    }

    angular.module('app').controller('ProductController', ProductController);
}