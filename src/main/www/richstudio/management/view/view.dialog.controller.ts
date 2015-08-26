/**
 * Created by BHAlrM on 8/11/2015 AD.
 */
module richstudio {
    class ViewImageDialogController {
        static $inject:string[] = ['$modalInstance', 'RichStudioDataService', '$filter', 'management', 'request'];

        private operatedImage:IImage;
        private imageList:IImage[];
        private isDisabledNextBtn:boolean = false;
        private isDisabledPreviosBtn:boolean = false;

        constructor(private $modalInstance:ng.ui.bootstrap.IModalServiceInstance,
                    private dataService:RichStudioDataService,
                    private $filter:ng.IFilterService,
                    private management:ManagementService,
                    private request:IViewDialogRequest) {
            this.activate();
        }

        public activate() {
            angular.extend(this, this.request);

            if (!this.imageList) {
                this.imageList = [this.operatedImage];
            }

        }

        public dismiss() {
            this.$modalInstance.dismiss(eViewAction.CLOSE);
        }

        public showNextImage() {
            var curImgIdx = this.imageList.indexOf(this.operatedImage);

            if (curImgIdx < this.imageList.length - 1) {
                this.operatedImage = this.imageList[curImgIdx + 1];
            } else {
                this.operatedImage = this.imageList[0];
            }
        }

        public showPreviousImage() {
            var curImgIdx = this.imageList.indexOf(this.operatedImage);
            if (curImgIdx > 0) {
                this.operatedImage = this.imageList[curImgIdx - 1];
            } else {
                this.operatedImage = this.imageList[this.imageList.length - 1];
            }
        }

        public rename() {
            var imageManagementDialogRequest:IImageManagementDialogRequest = {operatedImage: this.operatedImage};

            this.management.openRenameDialog(imageManagementDialogRequest).then((newName:string)=> {
                    var request:IEditImageRequest = {
                        txt_image_id: this.operatedImage.image_id,
                        txt_image_title: newName
                    };

                    this.dataService.editImage(request).then(()=> {
                        alert('successfully rename image');
                        this.operatedImage.image_title = newName;
                    });
                }
            );
        }

        public rotate() {
            var imageManagementDialogRequest:IImageManagementDialogRequest = {operatedImage: this.operatedImage};

            this.management.openRotateDialog(imageManagementDialogRequest).then((rotateDegrees:number)=> {
                var request:IRotateImageRequest = {
                    txt_image_id: this.operatedImage.image_id,
                    txt_rotate_degree: rotateDegrees
                };

                this.dataService.rotateImage(request).then(()=> {
                    alert('successfully rotate :' + rotateDegrees);
                });
            })
        }


        public crop() {
            var imageManagementDialogRequest:IImageManagementDialogRequest = {operatedImage: this.operatedImage};
            this.management.openCropDialog(imageManagementDialogRequest).then((cropRect:richstudio.ICropRect)=> {
                var request:ICropImageRequest = {
                    txt_image_id: this.operatedImage.image_id,
                    txt_crop_json: angular.toJson(cropRect)
                };

                this.dataService.cropImage(request).then(()=> {
                    alert('successfully crop :' + JSON.stringify(cropRect));
                });
            });
        }

        public delete() {
            var deletedImageIds = [{image_id: this.operatedImage.image_id}];
            var deleteImageRequest:richstudio.IDeleteImageRequest = {
                txt_delete_json: angular.toJson(deletedImageIds)
            };

            return this.dataService.deleteImages(deleteImageRequest).then(() => {
                var index = this.imageList.indexOf(this.operatedImage);
                this.imageList.splice(index, 1);
                alert('successfully delete image :' + JSON.stringify(this.operatedImage));
                this.dismiss();
            });
        }
        
    }


    angular.module('richstudio.management').controller('ViewImageDialogController', ViewImageDialogController);
}
