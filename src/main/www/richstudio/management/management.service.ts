/**
 * Created by BHAlrM on 8/7/2015 AD.
 */

module richstudio {

    export enum eViewAction{
        NEXT, PREVIOS, CLOSE
    }

    export interface IImageManagementDialogRequest{
        operatedImage?:IImage;
    }
    
    export interface IViewDialogRequest extends IImageManagementDialogRequest{
        imageList?:IImage[];
    }

    export interface IUploadDialogRequest extends IImageManagementDialogRequest{
        isMultiFileSelection:boolean;
    }
    
    export class ManagementService {
        static $inject:string[] = ['$modal', '$window'];

        constructor(private $modal:ng.ui.bootstrap.IModalService,
                    private $window:ng.IWindowService) {
        }

        public openViewDialog(request:IViewDialogRequest):ng.IPromise<any> {
            var modalOptions = {
                templateUrl: 'richstudio/management/view/view.dialog.template.html',
                controller: 'ViewImageDialogController',
                controllerAs: 'dialog',
                resolve: {
                    request: ()=>request
                }
            };
            return this.$modal.open(modalOptions).result;
        }

      
        public openRenameDialog(request:IImageManagementDialogRequest):ng.IPromise<string> {
            var modalOptions = {
                templateUrl: 'richstudio/management/rename/rename.dialog.template.html',
                controller: 'RenameImageDialogController',
                controllerAs: 'dialog',
                resolve: {
                    request: ()=>request
                }
            };

            return this.$modal.open(modalOptions).result;
        }

        public openCropDialog(request:IImageManagementDialogRequest):ng.IPromise<ICropRect> {
            var modalOptions = {
                templateUrl: 'richstudio/management/crop/crop.dialog.template.html',
                controller: 'CropImageDialogController',
                controllerAs: 'dialog',
                resolve: {
                    request: ()=>request
                }
            };

            return this.$modal.open(modalOptions).result;
        }


        public openRotateDialog(request:IImageManagementDialogRequest):ng.IPromise<number> {
            var modalOptions = {
                templateUrl: 'richstudio/management/rotate/rotate.dialog.template.html',
                controller: 'RotateImageDialogController',
                controllerAs: 'dialog',
                resolve: {
                    request: ()=>request
                }
            };

            return this.$modal.open(modalOptions).result;
        }

   
        public openUploadDialog(request:IUploadDialogRequest):ng.IPromise<File[]> {
            var modalOptions = {
                templateUrl: 'richstudio/management/upload/upload.dialog.template.html',
                controller: 'UploadDialogController',
                controllerAs: 'dialog',
                size: 'sm',
                resolve: {
                    request: ()=> request
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