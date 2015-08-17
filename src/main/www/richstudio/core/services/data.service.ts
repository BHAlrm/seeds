/**
 * Created by BHAlrM on 8/9/2015 AD.
 */

module richstudio {
    export interface IImage {
        image_id: number;
        image_name: string;
        image_title: string;
        image_url: string;
        image_create_time: string;
    }
    
    export interface IGallery {
        imagegallery_id: number;
        imagegallery_name: string;
        imagegallery_title: string;
        imagegallery_create_time: string;
    }

    export interface IList<T> {
        total_rows:number;
        result_rows:number;
        cur_page: string;
        per_page: string;
        sortby_id?: string;
        dataList?: T[];
    }
    
    export interface IEditedImage{
        image_file : File,
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

    export interface IRichStudioDataService{
        getGalleryList(curPage:number, perPage:number, sortBy?:string):ng.IPromise<IList<IGallery>>;
        getImageList(curPage:number, perPage:number, sortBy?:string):ng.IPromise<IList<IImage>>;
        getGalleryByID(id:string):ng.IPromise<IGallery>;
        getImageByID(id:string):ng.IPromise<IImage>;

    }
    
    export class RichStudioDataService {
        static $inject:string[] = ['$http', 'API'];

        constructor(private $http:ng.IHttpService, private API:IApi) {
        }

        public getGalleryList(curPage:number, perPage:number, sortBy?:string):ng.IPromise<IList<IGallery>> {
            var params = {
                cur_page: curPage,
                per_page: perPage,
                txt_sortby: sortBy
            };
            
            return this.$http
                .get<IResponse<IList<IGallery>>>(this.API.GALLERY + '/lists', <ng.IRequestShortcutConfig>{params: params})
                .then<IList<IGallery>>(this.getListData);

        }

        public getImageList(curPage:number, perPage:number, sortBy?:string):ng.IPromise<IList<IImage>> {
            var params = {
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

        private getListData<T>(response:ng.IHttpPromiseCallbackArg<IResponse<IList<T>>>):IList<T> {
            return response.data.data;
        }

        private getData<T>(response:ng.IHttpPromiseCallbackArg<IResponse<T>>):T {
            return response.data.data;
        }

    }

    angular.module('richstudio.core').service('RichStudioDataService', RichStudioDataService)
}