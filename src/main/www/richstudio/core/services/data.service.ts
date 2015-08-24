/**
 * Created by BHAlrM on 8/9/2015 AD.
 */

module richstudio {
    export interface IImage {
        image_id: string;
        image_name?: string;
        image_title?: string;
        image_url?: string;
        image_create_time?: string;
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

    export interface IEditedImage extends IImage {
        image_file : any,
        txt_crop_json? : Object
        txt_rotate_degree? : number
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
        image:IImage;
        cropRect:ICropRect;
        rotateDegrees?:number
    }

    export interface IUploadMultiImageRequest {
        images:IImage[];
        galleryId:string;
    }

    export class RichStudioDataService {
        static $inject:string[] = ['$http', 'API', 'DataUtils', 'Upload'];
        config:ng.IRequestShortcutConfig = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        };


        constructor(private $http:ng.IHttpService, private API:IApi, private utils:DataUtils, private uploader:ng.angularFileUpload.IUploadService) {
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

        public deleteImages(ids:string[]):ng.IHttpPromise<IResponse<IDeletedData>> {
            var deletedJson:IImage[] = [];
            if (!angular.isArray(ids)) {
                ids = [ids.toString()];
            }

            angular.forEach(ids, (id:string)=> {
                deletedJson.push({image_id: id});
            });

            var fd = new FormData();
            fd.append('txt_delete_json', JSON.stringify(deletedJson));

            return this.$http.post<IResponse<IDeletedData>>(this.API.IMAGE + '/delete', fd, this.config);
        }

        public editImage(imageId:string, imageTitle:string) {
            var fd = new FormData();
            fd.append('txt_image_id', imageId);
            fd.append('txt_image_title', imageTitle);

            return this.$http.post<IResponse<IDeletedData>>(this.API.IMAGE + '/edit', fd, this.config);
        }

        public uploadImage(request:IUploadImageRequest, progressFn:(ev:ProgressEvent) => any) {
            var defaultCropRect:ICropRect = {
                cx: 100,
                cy: 100,
                rect_size: 250
            };
            angular.extend(defaultCropRect, request.cropRect);
            var fd = new FormData();
            fd.append('image_file', request.image.file);
            fd.append('txt_crop_rect_json', JSON.stringify(defaultCropRect));

            if (request.rotateDegrees) {
                fd.append('txt_rotate_degree', request.rotateDegrees);
            }

            var config = angular.copy(this.config);
            config.headers = {
                __XHR__: function () {
                    return function (xhr:XMLHttpRequest) {
                        xhr.upload.addEventListener("progress", progressFn);
                    };
                },
                "Content-Type": "multipart/form-data"
            };

            return this.$http.post<IResponse<IDeletedData>>(this.API.IMAGE + '/upload', fd, config);
            //return this.uploader.http(config);
        }


        public uploadImageToGallery(request:IUploadMultiImageRequest, progressFn:(ev:ProgressEvent) => any) {
            var fd = new FormData();
            fd.append("txt_imagegallery_id", request.galleryId);
            angular.forEach(request.images, (image:IImage)=> {
                fd.append("image_files[]", image.file);
            });


            var config = angular.copy(this.config);
            config.headers = {
                __XHR__: function () {
                    return function (xhr:XMLHttpRequest) {
                        xhr.upload.addEventListener("progress", progressFn);
                    };
                },
                "Content-Type": "multipart/form-data"
            };

            return this.$http.post<IResponse<IDeletedData>>(this.API.GALLERY + '/upload_image', fd, config);

        }

        private getListData<T>(response:ng.IHttpPromiseCallbackArg<IResponse<IList<T>>>):IList<T> {
            return response.data.data;
        }

        private getData<T>(response:ng.IHttpPromiseCallbackArg<IResponse<T>>):T {
            return response.data.data;
        }


    }

    angular.module('richstudio.core').service('RichStudioDataService', RichStudioDataService)
}