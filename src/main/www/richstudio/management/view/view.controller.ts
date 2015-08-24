/**
 * Created by BHAlrM on 8/11/2015 AD.
 */
module richstudio {
    class ViewImageDialogController {
        static $inject:string[] = ['$modalInstance', 'RichStudioDataService', '$filter', 'management', 'request'];

        private imageList:IImage[];
        private displayedImageNumber:number;
        private isDisabledNextBtn:boolean = false;
        private isDisabledPreviosBtn:boolean = false;

        constructor(private $modalInstance:ng.ui.bootstrap.IModalServiceInstance,
                    private dataService:RichStudioDataService,
                    private $filter:ng.IFilterService,
                    private management:ManagementService,
                    private request:IViewReqest) {
            this.activate();
        }

        public activate() {
            if (this.request.imageId && this.request.galleryId) {
                this.getImageList()
                    .then((imageList:richstudio.IImage[])=> {
                        this.imageList = imageList;
                        var targetImage = this.$filter('filter')(this.imageList, {image_id: this.request.imageId})[0];
                        this.displayedImageNumber = this.imageList.indexOf(targetImage);
                    });
            } else {
                this.imageList = [this.request.image];
                this.displayedImageNumber = 0;
            }

        }

        private getImageList() {
            return this.dataService.getImageList(this.request.galleryId, 1, 10).then((list:richstudio.IList<richstudio.IImage>) => {
                return list.dataList
            });
        }


        public dismiss() {
            this.$modalInstance.dismiss(eViewAction.CLOSE);
        }

        public showNextImage() {
            if (this.displayedImageNumber < this.imageList.length - 1) {
                this.displayedImageNumber += 1;
            }
        }

        public showPreviousImage() {
            if (this.displayedImageNumber > 0) {
                this.displayedImageNumber -= 1;
            }
        }

        public rename() {
            this.management.openRenameDialog(this.imageList[this.displayedImageNumber]).then((newName:string)=> {
                this.dataService.editImage(this.imageList[this.displayedImageNumber].image_id, newName).then(()=> {
                    this.imageList[this.displayedImageNumber].image_title = newName;
                    alert('successfully rename image');
                });
            });
        }

        public rotate() {
            this.management.openRotateDialog(this.imageList[this.displayedImageNumber]).then((rotateDegrees:number)=> {
                alert('successfully rotate :' + rotateDegrees);
            })
        }


        public crop() {
            this.management.openCropDialog(this.imageList[this.displayedImageNumber]).then((cropRect:richstudio.ICropRect)=> {
                alert('successfully crop :' + JSON.stringify(cropRect));

            });
        }

        public delete() {

        }


    }


    angular.module('richstudio.management').controller('ViewImageDialogController', ViewImageDialogController);
}
