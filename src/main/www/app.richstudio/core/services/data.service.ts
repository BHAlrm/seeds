/**
 * Created by BHAlrM on 8/9/2015 AD.
 */

module app.richstudio {

    interface FormData {
        enctype?:string;
        append(name:any, value:any, blobName?:string): void;
    }

    declare var FormData:{
        prototype: FormData;
        new(): FormData;
    };

    export interface IImage {
        image_id: string;
        image_name?: string;
        image_title?: string;
        image_file_name?: string;
        image_file_dir?:string;
        image_width?:string;
        image_height?:string;
        image_url?: string;
        image_create_time?: string;
        image_update_time?: string;
    }

    export interface IGallery {
        imagegallery_id: string;
        imagegallery_name?: string;
        imagegallery_title?: string;
        imagegallery_create_time?: string;
    }

    export interface IList<T> {
        total_rows:number;
        result_rows:number;
        cur_page: string;
        per_page: string;
        sortby_id?: string;
        dataList?: T[];
    }

    export interface IRequestListParams {
        cur_page: number;
        per_page: number;
        txt_sortby?: string;
    }

    export interface IResponse<T> {
        ok:number;
        msg: string;
        data: T;
    }

    export interface IDeletedData {
        total: number
        success: number
        detail: any[]
    }

    export interface IUploadImageRequest {
        image_file:Blob;
        txt_crop_rect_json:string;
        txt_rotate_degree?:number
    }

    export interface IUploadMultiImageRequest {
        "image_files[]":Blob[];
        txt_imagegallery_id:string;
    }

    export interface IImageManagementRequest {
        txt_image_id:string;
    }

    export interface IEditImageRequest extends IImageManagementRequest {
        txt_image_title:string;
    }

    export interface ICropImageRequest extends IImageManagementRequest {
        txt_crop_json:string;
    }

    export interface IRotateImageRequest extends IImageManagementRequest {
        txt_rotate_degree:number;
    }

    export interface IDeleteImageRequest {
        txt_delete_json:string;
    }
    
    export interface ICreateGalleryRequest{
        txt_name:string;
        txt_title?:string;
        txt_description?:string;
    }

    export class RichStudioDataService {
        static $inject:string[] = ['$http', 'API', 'DataUtils', 'Upload'];
        config:ng.IRequestShortcutConfig = {
            headers: {
                "Content-Type": undefined
            },
            transformRequest: angular.identity
        };


        constructor(private $http:ng.IHttpService, private API:IApi, private utils:DataUtils, private uploader:ng.angularFileUpload.IUploadService) {
        }
        
        public addGallery(request:ICreateGalleryRequest):ng.IHttpPromise<IResponse<IGallery>>{
            var fd = this.formEncrypting(request);
            return this.$http.post<IResponse<IGallery>>(this.API.GALLERY + '/add', fd, this.config);
        }

        public getGalleryList(curPage:number, perPage:number, sortBy?:string):ng.IPromise<IList<IGallery>> {
            var params:IRequestListParams = {
                cur_page: curPage,
                per_page: perPage,
                txt_sortby: sortBy
            };

            return this.$http
                .get<IResponse<IList<IGallery>>>(this.API.GALLERY + '/lists', <ng.IRequestShortcutConfig>{params: params})
                .then<IList<IGallery>>(this.getListData);

        }

        public getImageList(galleryId:string, curPage:number, perPage:number, sortBy?:string):ng.IPromise<IList<IImage>> {
            var params:IRequestListParams = {
                txt_imagegallery_id: galleryId,
                cur_page: curPage,
                per_page: perPage,
                txt_sortby: sortBy
            };
            return this.$http
                .get<IResponse<IList<IImage>>>(this.API.IMAGE + '/lists', <ng.IRequestShortcutConfig>{params: params})
                .then<IList<IImage>>(this.getListData);
        }

        public getGalleryByID(id:string):ng.IPromise<IGallery> {
            var params = {
                txt_imagegallery_id: id
            };
            return this.$http
                .get<IResponse<IGallery>>(this.API.GALLERY + '/id', <ng.IRequestShortcutConfig>{params: params})
                .then<IGallery>(this.getData);
        }

        public getImageByID(id:string):ng.IPromise<IImage> {
            var params = {
                txt_image_id: id
            };
            return this.$http
                .get<IResponse<IImage>>(this.API.IMAGE + '/id', <ng.IRequestShortcutConfig>{params: params})
                .then<IImage>(this.getData);
        }


        public deleteGalleries(ids:string[]):ng.IHttpPromise<IResponse<IDeletedData>> {
            var deletedJson:IGallery[] = [];
            if (!angular.isArray(ids)) {
                ids = [ids.toString()];
            }

            angular.forEach(ids, (id:string)=> {
                deletedJson.push({imagegallery_id: id});
            });

            var fd = new FormData();
            fd.append('txt_delete_json', JSON.stringify(deletedJson));

            return this.$http.post<IResponse<IDeletedData>>(this.API.GALLERY + '/delete', fd, this.config);
        }

        public deleteImages(request:IDeleteImageRequest):ng.IHttpPromise<IResponse<IDeletedData>> {
            var fd = this.formEncrypting(request);
            return this.$http.post<IResponse<IDeletedData>>(this.API.IMAGE + '/delete', fd, this.config);
        }

        public editImage(request:IEditImageRequest) {
            var fd = this.formEncrypting(request);
            return this.$http.post<IResponse<IDeletedData>>(this.API.IMAGE + '/edit', fd, this.config);
        }

        public cropImage(request:ICropImageRequest) {
            var fd = this.formEncrypting(request);
            return this.$http.post<IResponse<IDeletedData>>(this.API.IMAGE + '/crop', fd, this.config);
        }

        public rotateImage(request:IRotateImageRequest) {
            var fd = this.formEncrypting(request);
            return this.$http.post<IResponse<IDeletedData>>(this.API.IMAGE + '/rotate', fd, this.config);
        }

        public uploadImage(request:IUploadImageRequest, processFn:()=>(xhr:XMLHttpRequest)=>void) {
            var fd = this.formEncrypting(request);
            var config = angular.copy(this.config);
            config.headers.__setXHR_ = processFn;
            return this.$http.post<IResponse<IDeletedData>>(this.API.IMAGE + '/upload', fd, config);
        }


        public uploadImageToGallery(request:IUploadMultiImageRequest, processFn:()=>(xhr:XMLHttpRequest)=>void) {
            var fd = this.formEncrypting(request);
            var config = angular.copy(this.config);
            config.headers.__setXHR_ = processFn;
            return this.$http.post<IResponse<IDeletedData>>(this.API.GALLERY + '/upload_image', fd, config);
        }

        private getListData<T>(response:ng.IHttpPromiseCallbackArg<IResponse<IList<T>>>):IList<T> {
            return response.data.data;
        }

        private getData<T>(response:ng.IHttpPromiseCallbackArg<IResponse<T>>):T {
            return response.data.data;
        }

        private formEncrypting(obj:any):FormData {
            var fd = new FormData();

            Object.keys(obj).forEach((property:string)=> {
                let value = obj[property];
                if (angular.isUndefined(value)) return;
                
                if (angular.isArray(value)) {
                    if (value[0] instanceof File) {
                        angular.forEach(value, (file:File)=> {
                            fd.append(property, file);
                        });
                    } else {
                        fd.append(property, angular.toJson(value));
                    }

                } else {
                    if (value instanceof File) {
                        fd.enctype = 'multipart/form-data';
                        fd.append(property, value);
                    } else {
                        if (angular.isObject(value)) {
                            fd.append(property, angular.toJson(value));
                        } else {
                            fd.append(property, value);
                        }

                    }
                }

            });

            return fd;
        }


    }

    angular.module('app.richstudio.core').service('RichStudioDataService', RichStudioDataService)
}