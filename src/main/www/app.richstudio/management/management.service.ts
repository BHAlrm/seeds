/**
 * Created by BHAlrM on 8/7/2015 AD.
 */

module app.richstudio {

    export enum eViewAction{
        NEXT, PREVIOS, CLOSE
    }

    export interface IImageManagementDialogRequest {
        operatedImage?:IImage;
    }

    export interface IViewDialogRequest extends IImageManagementDialogRequest {
        imageList?:IImage[];
    }

    export interface IUploadDialogRequest extends IImageManagementDialogRequest {
        isMultiFileSelection:boolean;
    }
    
    export interface ICreateGalleryDialogRequest{
        userId?: string;
    }
    
    export interface IGalleryDialogRequest {
        galleryId:string;
    }

    export class ManagementService {
        static $inject:string[] = ['$modal', '$window'];

        constructor(private $modal:ng.ui.bootstrap.IModalService,
                    private $window:ng.IWindowService) {
        }
        
        public openCreateGalleryDialog(request:ICreateGalleryDialogRequest):ng.IPromise<any>{
            var modalOptions = {
                templateUrl: 'app.richstudio/management/create/create.dialog.template.html',
                controller: 'CreateGalleryDialogController',
                controllerAs: 'dialog',
                resolve: {
                    request: ()=>request
                }
            };
            return this.$modal.open(modalOptions).result;
        }

        public openViewDialog(request:IViewDialogRequest):ng.IPromise<any> {
            var modalOptions = {
                templateUrl: 'app.richstudio/management/view/view.dialog.template.html',
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
                templateUrl: 'app.richstudio/management/rename/rename.dialog.template.html',
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
                templateUrl: 'app.richstudio/management/crop/crop.dialog.template.html',
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
                templateUrl: 'app.richstudio/management/rotate/rotate.dialog.template.html',
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
                templateUrl: 'app.richstudio/management/upload/upload.dialog.template.html',
                controller: 'UploadDialogController',
                controllerAs: 'dialog',
                size: 'sm',
                resolve: {
                    request: ()=> request
                }
            };

            return this.$modal.open(modalOptions).result;
        }
        
        public openGalleryDialog(request:IGalleryDialogRequest):ng.IPromise<IImage>{
            var modalOptions = {
                templateUrl: 'app.richstudio/management/gallery/galleryDialog.template.html',
                controller: 'GalleryDialogController',
                controllerAs: 'dialog',
                size: 'lg',
                resolve: {
                    request: ()=> request
                }
            };

            return this.$modal.open(modalOptions).result;
        }


        public uploadImage(image:IImage, cropRect?:ICropRect, rotateDegrees?:number) {

            var modalOptions = {
                templateUrl: 'app.richstudio/management/upload/uploader.dialog.template.html',
                controller: 'UploaderDialogController',
                controllerAs: 'dialog',
                size: 'sm',
                backdrop: 'static',
                resolve: {

                    uploadRequest: () => <IUploadImageRequest>{
                        image_file: image.file,
                        txt_crop_rect_json: angular.toJson(cropRect),
                        txt_rotate_degree: rotateDegrees
                    }
                }
            };

            return this.$modal.open(modalOptions).result;

        }

        public uploadMultiImage(images:IImage[], galleryId:string) {
            var imageFiles:Blob[] = [];
            angular.forEach(images, (image:IImage)=> {
                imageFiles.push(image.file);
            });
            
            var modalOptions = {
                templateUrl: 'app.richstudio/management/upload/uploader.dialog.template.html',
                controller: 'UploaderDialogController',
                controllerAs: 'dialog',
                size: 'sm',
                backdrop: 'static',
                resolve: {
                    uploadRequest: () => <IUploadMultiImageRequest>{
                        "image_files[]": imageFiles,
                        txt_imagegallery_id: galleryId
                    }
                }
            };

            return this.$modal.open(modalOptions).result;

        }

    }

    angular.module('app.richstudio.management').service('management', ManagementService);
}