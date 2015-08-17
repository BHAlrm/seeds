///**
// * Created by BHAlrM on 8/9/2015 AD.
// */
//module app {
//
//    interface IImage extends app.core.IImage {
//        selected?: boolean;
//    }
//
//
//    class GalleryController {
//        static $inject:string[] = ['DataService', '$routeParams', 'imgManagement'];
//
//        private curPage:number;
//        private perPage:number;
//        private sortBy:string;
//
//        private imageList:IImage[];
//        private gallery:app.core.IGallery;
//
//
//        constructor(private dataService:app.core.DataService, private $routeParams:ng.route.IRouteParamsService, private imgManagement:app.components.IImgManagementService) {
//            this.activate();
//        }
//
//        private activate() {
//
//            this.getGallery()
//                .then((gallery:app.core.IGallery)=> {
//                    this.gallery = gallery;
//                })
//                .then(()=> {
//                    this.getImageList()
//                        .then((imageList:app.core.IImage[])=> {
//                            this.imageList = imageList;
//                        });
//                });
//
//        }
//
//        private getImageList() {
//
//            return this.dataService.getImageList(1, 10).then((list:app.core.IList<app.core.IImage>) => {
//                return list.dataList
//            });
//        }
//
//        private getGallery() {
//            var galleryId = this.$routeParams["id"];
//
//            return this.dataService.getGalleryByID(galleryId);
//        }
//
//        private openImage(image:IImage) {
//            this.imgManagement.openViewDialog(image);
//        }
//
//
//        public clearAll() {
//            this.setSelect(false);
//        }
//
//        public selectAll() {
//            this.setSelect(true);
//        }
//
//        private setSelect(isSelectAll:boolean) {
//            _.each(this.imageList, (image:IImage)=> {
//                image.selected = isSelectAll
//            });
//        }
//
//    }
//    angular.module('app').controller('GalleryController', GalleryController);
//}