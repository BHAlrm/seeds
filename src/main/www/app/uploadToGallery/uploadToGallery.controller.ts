/**
 * Created by BHAlrM on 8/12/2015 AD.
 */
module app {

    class UploadToGalleryController {
        static $inject:string[] = ['$scope', 'management'];

        images:richstudio.IImage[];
        cropRect:richstudio.ICropRect;
        rotateDegree:number;

        constructor(private $scope:ng.IScope,
                    private management:richstudio.ManagementService) {
            this.activate();
        }

        public activate() {
           
        }


        public openImgUploadDialog() {
            var uploadDialogRequest:richstudio.IUploadDialogRequest = {
                isMultiFileSelection: true
            };
            
            this.management.openUploadDialog(uploadDialogRequest)
                .then((files:File[])=>{
                    this.images = [];
                    _.each(files, (file:File)=>{
                        
                        var fr = new FileReader();
                        fr.onload = (e:Event)=>{
                            this.$scope.$apply(()=>{
                                var readedFile = <FileReader>e.target;
                                var image:richstudio.IImage = {
                                    image_id: "-1",
                                    image_url: readedFile.result,
                                    file: file
                                };
                                this.images.push(image);
                            });
                           
                        };
                        fr.readAsDataURL(file);
                        
                    })
                });
        }
        
        public submit(){
            this.management.uploadMultiImage(this.images, "0").then(()=>{
            });
        }

    }

    angular.module('app').controller('UploadToGalleryController', UploadToGalleryController);
}