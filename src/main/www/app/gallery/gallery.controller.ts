/**
 * Created by BHAlrM on 8/9/2015 AD.
 */
module app {

    interface IImage extends richstudio.IImage {
        selected?: boolean;
    }


    class GalleryController {
        static $inject:string[] = ['$scope', 'RichStudioDataService', '$routeParams', 'management'];

        private curPage:number;
        private perPage:number;
        private sortBy:string;
        private showSelected:boolean = false;

        private imageList:IImage[];
        private gallery:richstudio.IGallery;

        constructor(private $scope:ng.IScope,
                    private dataService:richstudio.RichStudioDataService,
                    private $routeParams:ng.route.IRouteParamsService,
                    private management:richstudio.ManagementService) {
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

        getImageList = () => {
            return this.dataService.getImageList(this.gallery.imagegallery_id, 1, 10).then((list:richstudio.IList<richstudio.IImage>) => {
                return list.dataList
            });
        }

        private getGallery() {
            var galleryId = this.$routeParams["id"];

            return this.dataService.getGalleryByID(galleryId);
        }

        public clearAll() {
            this.setSelect(false);
        }

        public selectAll() {
            this.setSelect(true);
        }

        public showImage(image:richstudio.IImage) {
            var viewDialogRequest:richstudio.IViewDialogRequest = {
                operatedImage: image,
                imageList: this.imageList
            };

            this.management.openViewDialog(viewDialogRequest);
        }

        public select() {
            this.showSelected = true;
        }

        public getRectUrl(image:richstudio.IImage):string {
            var url = image.image_url.replace(image.image_file_name, 'r100_' + image.image_file_name);
            return url;
        }

        private setSelect(isSelectAll:boolean) {
            _.each(this.imageList, (image:IImage)=> {
                image.selected = isSelectAll
            });
        }

        public openImgUploadDialog() {
            var uploadDialogRequest:richstudio.IUploadDialogRequest = {
                isMultiFileSelection: true
            };

            this.management.openUploadDialog(uploadDialogRequest)
                .then((files:File[])=> {
                    var images:richstudio.IImage[] = [];
                    _.each(files, (file:File)=> {
                        var image:richstudio.IImage = {
                            image_id: "-1",
                            file: file
                        };
                        images.push(image);
                    });
                    return images;
                }).then((images:IImage[])=> {
                    this.management.uploadMultiImage(images, this.gallery.imagegallery_id).then(()=> {
                        this.getImageList()
                            .then((imageList:richstudio.IImage[])=> {
                                this.imageList = imageList;
                            });
                    });
                });
        }


        private delete() {
            var deletedImageIds = _.map(this.imageList, (image:richstudio.IImage)=> {
                if (image.selected) return {image_id: image.image_id};
            });

            var deleteImageRequest:richstudio.IDeleteImageRequest = {
                txt_delete_json: angular.toJson(deletedImageIds)
            };

            return this.dataService.deleteImages(deleteImageRequest).then(() => {
                this.getImageList()
                    .then((imageList:richstudio.IImage[])=> {
                        this.imageList = imageList;
                    });
            });
        }

    }
    angular.module('app').controller('GalleryController', GalleryController);
}