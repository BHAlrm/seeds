/**
 * Created by BHAlrM on 8/9/2015 AD.
 */
module richstudio {

    export interface IImage{
        selected?: boolean;
    }


    class GalleryDialogController {
        static $inject:string[] = ['RichStudioDataService', 'galleryId'];

        private curPage:number;
        private perPage:number;
        private sortBy:string;

        private imageList:IImage[];
        private gallery:richstudio.IGallery;


        constructor(private dataService:richstudio.RichStudioDataService, private galleryId:string, private management:ManagementService) {
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

            return this.dataService.getImageList(1, 10).then((list:richstudio.IList<richstudio.IImage>) => {
                return list.dataList
            });
        }

        private getGallery() {
            return this.dataService.getGalleryByID(this.galleryId);
        }

        private openImage(image:IImage) {
            //this.management.openViewDialog(image);
        }


        public clearAll() {
            this.setSelect(false);
        }

        public selectAll() {
            this.setSelect(true);
        }

        private setSelect(isSelectAll:boolean) {
            _.each(this.imageList, (image:IImage)=> {
                image.selected = isSelectAll
            });
        }

    }
    angular.module('richstudio.management').controller('GalleryDialogController', GalleryDialogController);
}