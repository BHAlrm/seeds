/**
 * Created by BHAlrM on 8/9/2015 AD.
 */
module app.richstudio {

    export interface IImage {
        selected?: boolean;
    }


    class GalleryDialogController {
        static $inject:string[] = ['RichStudioDataService', 'request', '$modalInstance'];

        private curPage:number;
        private perPage:number;
        private sortBy:string;
        private showSelected:boolean = false;

        private imageList:IImage[];
        private gallery:richstudio.IGallery;


        constructor(private dataService:richstudio.RichStudioDataService,
                    private request:IGalleryDialogRequest,
                    private $modalInstance:ng.ui.bootstrap.IModalServiceInstance) {
            this.activate();
        }

        private activate() {

            this.getGallery()
                .then((gallery:richstudio.IGallery)=> {
                    this.gallery = gallery;
                })
                .then(()=> {
                    this.getImageList()
                        .then((imageList:richstudio.IImage[])=> {
                            this.imageList = imageList;
                        });
                });

        }

        private getImageList() {
            return this.dataService.getImageList(this.gallery.imagegallery_id, 1, 10).then((list:richstudio.IList<richstudio.IImage>) => {
                return list.dataList
            });
        }

        private getGallery() {
            return this.dataService.getGalleryByID(this.request.galleryId);
        }

        
        public select(image:IImage) {
            this.$modalInstance.close(image);
        }

        
    }
    angular.module('app.richstudio.management').controller('GalleryDialogController', GalleryDialogController);
}