/**
 * Created by BHAlrM on 8/7/2015 AD.
 */

module richstudio {
    export enum eUploadAction{
        UPLOAD, EDIT, SELECT_FROM_GALLERY
    }

    export enum eViewAction{
        NEXT, PREVIOS, CLOSE
    }

    export enum eImageManagementAction{
        RENAME, CROP, ROTATE, DELETE
    }

    export interface IUploadAction {
        action: eUploadAction;
        image: IEditedImage;
    }

    export interface IRenameImageRequestData {
        image:IImage;
    }


    export interface IImageManagementRequest {
        action: eImageManagementAction;
        data: any;
    }

    export interface IViewReqest {
        galleryId?: string,
        imageId?: string,
        image?: IImage
    }

    export class ManagementService {
        static $inject:string[] = ['$modal', '$window'];

        constructor(private $modal:ng.ui.bootstrap.IModalService,
                    private $window:ng.IWindowService) {
        }

        public openViewDialog(galleryId:string, imageId:string) {
            var modalOptions = {
                templateUrl: 'richstudio/management/view/view.template.html',
                controller: 'ViewImageDialogController',
                controllerAs: 'dialog',
                resolve: {
                    request: ()=><IViewReqest>{
                        galleryId: galleryId,
                        imageId: imageId
                    }
                }
            };


            return this.$modal.open(modalOptions).result;
        }

        public openViewDialogWithImage(image:IImage) {
            var modalOptions = {
                templateUrl: 'richstudio/management/view/view.template.html',
                controller: 'ViewImageDialogController',
                controllerAs: 'dialog',
                resolve: {
                    request: ()=><IViewReqest>{
                        image:image
                    }
                }
            };


            return this.$modal.open(modalOptions).result;
        }

        public openRenameDialog(image:IImage):angular.IPromise<string> {
            var modalOptions = {
                templateUrl: 'richstudio/management/rename/rename.template.html',
                controller: 'RenameImageDialogController',
                controllerAs: 'dialog',
                resolve: {
                    image: ()=>image
                }
            };

            return this.$modal.open(modalOptions).result;
        }

        public openCropDialog(image:IImage):angular.IPromise<ICropRect> {
            var modalOptions = {
                templateUrl: 'richstudio/management/crop/crop.template.html',
                controller: 'CropImageDialogController',
                controllerAs: 'dialog',
                resolve: {
                    image: ()=>image
                }
            };

            return this.$modal.open(modalOptions).result;
        }


        public openRotateDialog(image:IImage):angular.IPromise<number> {
            var modalOptions = {
                templateUrl: 'richstudio/management/rotate/rotate.template.html',
                controller: 'RotateImageDialogController',
                controllerAs: 'dialog',
                resolve: {
                    image: ()=>image
                }
            };

            return this.$modal.open(modalOptions).result;
        }

        public openGalleryDialog(galleryId:string) {
            var modalOptions = {
                templateUrl: 'richstudio/management/gallery/galleryDialog.template.html',
                controller: 'GalleryDialogController',
                controllerAs: 'dialog',
                size: 'lg',
                resolve: {
                    galleryId: ()=>galleryId
                }
            };

            return this.$modal.open(modalOptions).result;
        }

        public openUploadDialog(image?:IImage):ng.IPromise<File[]> {
            var modalOptions = {
                templateUrl: 'richstudio/management/upload/upload.dialog.template.html',
                controller: 'UploadDialogController',
                controllerAs: 'dialog',
                size: 'sm',
                resolve: {
                    image: ()=> image
                }
            };

            return this.$modal.open(modalOptions).result;
        }


        public uploadImage(image:IImage, cropRect:ICropRect, rotateDegrees:number) {

            var modalOptions = {
                templateUrl: 'richstudio/management/upload/uploader.dialog.template.html',
                controller: 'UploaderDialogController',
                controllerAs: 'dialog',
                size: 'sm',
                backdrop: 'static',
                resolve: {

                    uploadRequest: () => <IUploadImageRequest>{
                        image: image,
                        cropRect: cropRect,
                        rotateDegrees: rotateDegrees
                    }
                }
            };

            return this.$modal.open(modalOptions).result;

        }

        public uploadMultiImage(images:IImage[], galleryId:string) {

            var modalOptions = {
                templateUrl: 'richstudio/management/upload/uploader.dialog.template.html',
                controller: 'UploaderDialogController',
                controllerAs: 'dialog',
                size: 'sm',
                backdrop: 'static',
                resolve: {
                    uploadRequest: () => <IUploadMultiImageRequest>{
                        images:images,
                        galleryId:galleryId
                    }
                }
            };

            return this.$modal.open(modalOptions).result;

        }

    }

    angular.module('richstudio.management').service('management', ManagementService);
}