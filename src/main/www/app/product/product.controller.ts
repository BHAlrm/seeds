/**
 * Created by BHAlrM on 8/12/2015 AD.
 */
module app {

    class ProductController {
        static $inject:string[] = ['management', 'notify'];

        image:richstudio.IImage;
        cropRect:richstudio.ICropRect;
        rotateDegree:number;

        constructor(private management:richstudio.ManagementService, private notify:ng.cgNotify.INotifyService) {
            this.activate();
        }

        public activate() {
            this.image = {
                image_id: '-1',
                image_url: 'http://placehold.it/350x150'
            };
        }

        public openImgUploadDialog() {
            var uploadDialogRequest:richstudio.IUploadDialogRequest = {
                isMultiFileSelection: false,
                operatedImage: this.image
            };
            
            this.management.openUploadDialog(uploadDialogRequest)
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
            });
        }
        

    }

    angular.module('app').controller('ProductController', ProductController);
}