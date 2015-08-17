/// <reference path="../../../../typing/tsd.d.ts" />
declare module richstudio {
}

declare module richstudio {
}

declare module richstudio {
    enum eUploadAction {
        UPLOAD = 0,
        EDIT = 1,
        SELECT_FROM_GALLERY = 2,
    }
    interface IUploadAction {
        action: eUploadAction;
        image: IEditedImage;
    }
    class ManagementService {
        private $modal;
        static $inject: string[];
        constructor($modal: ng.ui.bootstrap.IModalService);
        openViewDialog(image?: IEditedImage): angular.IPromise<IEditedImage>;
        openUploadDialog(image: IEditedImage): ng.IPromise<IEditedImage>;
    }
}

declare module richstudio {
}

declare module richstudio {
    interface IRotateScope extends ng.IScope {
        degrees: number;
    }
}

declare module richstudio {
}


declare module richstudio {
    interface IImage {
        selected?: boolean;
    }
}

declare module richstudio {
    interface IApi {
        GALLERY: string;
        IMAGE: string;
    }
}

declare module richstudio {
    interface IImage {
        image_id: number;
        image_name: string;
        image_title: string;
        image_url: string;
        image_create_time: string;
    }
    interface IGallery {
        imagegallery_id: number;
        imagegallery_name: string;
        imagegallery_title: string;
        imagegallery_create_time: string;
    }
    interface IList<T> {
        total_rows: number;
        result_rows: number;
        cur_page: string;
        per_page: string;
        sortby_id?: string;
        dataList?: T[];
    }
    interface IEditedImage {
        image_file: File;
        txt_crop_json?: Object;
        txt_rotate_degree?: number;
    }
    interface IRequestListParams {
        cur_page: number;
        per_page: number;
        txt_sortby?: string;
    }
    interface IResponse<T> {
        ok: number;
        msg: string;
        data: T;
    }
    interface IRichStudioDataService {
        getGalleryList(curPage: number, perPage: number, sortBy?: string): ng.IPromise<IList<IGallery>>;
        getImageList(curPage: number, perPage: number, sortBy?: string): ng.IPromise<IList<IImage>>;
        getGalleryByID(id: string): ng.IPromise<IGallery>;
        getImageByID(id: string): ng.IPromise<IImage>;
    }
    class RichStudioDataService {
        private $http;
        private API;
        static $inject: string[];
        constructor($http: ng.IHttpService, API: IApi);
        getGalleryList(curPage: number, perPage: number, sortBy?: string): ng.IPromise<IList<IGallery>>;
        getImageList(curPage: number, perPage: number, sortBy?: string): ng.IPromise<IList<IImage>>;
        getGalleryByID(id: string): ng.IPromise<IGallery>;
        getImageByID(id: string): ng.IPromise<IImage>;
        private getListData<T>(response);
        private getData<T>(response);
    }
}

declare module richstudio {
    interface IUploadDialogScope extends ng.IScope {
        fileChange(): void;
    }
    class UploadDialogController {
        private $modalInstance;
        private $scope;
        private image;
        static $inject: string[];
        constructor($modalInstance: ng.ui.bootstrap.IModalServiceInstance, $scope: IUploadDialogScope, image: IEditedImage);
        activate(): void;
        upload($files: File[], $file: File, $event: Event, $rejectedFiles: File): void;
        editImage(): void;
        selectFormGallery(): void;
    }
}
