/// <reference path="../../../../typing/tsd.d.ts" />
declare module richstudio {
}

declare module richstudio {
}

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
    enum eViewAction {
        NEXT = 0,
        PREVIOS = 1,
        CLOSE = 2,
    }
    enum eImageManagementAction {
        RENAME = 0,
        CROP = 1,
        ROTATE = 2,
        DELETE = 3,
    }
    interface IUploadAction {
        action: eUploadAction;
        image: IEditedImage;
    }
    interface IRenameImageRequestData {
        image: IImage;
    }
    interface IImageManagementRequest {
        action: eImageManagementAction;
        data: any;
    }
    interface IViewReqest {
        galleryId?: string;
        imageId?: string;
        image?: IImage;
    }
    class ManagementService {
        private $modal;
        private $window;
        static $inject: string[];
        constructor($modal: ng.ui.bootstrap.IModalService, $window: ng.IWindowService);
        openViewDialog(galleryId: string, imageId: string): ng.IPromise<any>;
        openViewDialogWithImage(image: IImage): ng.IPromise<any>;
        openRenameDialog(image: IImage): angular.IPromise<string>;
        openCropDialog(image: IImage): angular.IPromise<ICropRect>;
        openRotateDialog(image: IImage): angular.IPromise<number>;
        openGalleryDialog(galleryId: string): ng.IPromise<any>;
        openUploadDialog(image?: IImage): ng.IPromise<File[]>;
        uploadImage(image: IImage, cropRect: ICropRect, rotateDegrees: number): ng.IPromise<any>;
        uploadMultiImage(images: IImage[], galleryId: string): ng.IPromise<any>;
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
        image_id: string;
        image_name?: string;
        image_title?: string;
        image_url?: string;
        image_create_time?: string;
    }
    interface IGallery {
        imagegallery_id: string;
        imagegallery_name?: string;
        imagegallery_title?: string;
        imagegallery_create_time?: string;
    }
    interface IList<T> {
        total_rows: number;
        result_rows: number;
        cur_page: string;
        per_page: string;
        sortby_id?: string;
        dataList?: T[];
    }
    interface IEditedImage extends IImage {
        image_file: any;
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
    interface IDeletedData {
        total: number;
        success: number;
        detail: any[];
    }
    interface IUploadImageRequest {
        image: IImage;
        cropRect: ICropRect;
        rotateDegrees?: number;
    }
    interface IUploadMultiImageRequest {
        images: IImage[];
        galleryId: string;
    }
    class RichStudioDataService {
        private $http;
        private API;
        private utils;
        private uploader;
        static $inject: string[];
        config: ng.IRequestShortcutConfig;
        constructor($http: ng.IHttpService, API: IApi, utils: DataUtils, uploader: ng.angularFileUpload.IUploadService);
        getGalleryList(curPage: number, perPage: number, sortBy?: string): ng.IPromise<IList<IGallery>>;
        getImageList(galleryId: string, curPage: number, perPage: number, sortBy?: string): ng.IPromise<IList<IImage>>;
        getGalleryByID(id: string): ng.IPromise<IGallery>;
        getImageByID(id: string): ng.IPromise<IImage>;
        deleteGalleries(ids: string[]): ng.IHttpPromise<IResponse<IDeletedData>>;
        deleteImages(ids: string[]): ng.IHttpPromise<IResponse<IDeletedData>>;
        editImage(imageId: string, imageTitle: string): ng.IHttpPromise<IResponse<IDeletedData>>;
        uploadImage(request: IUploadImageRequest, progressFn: (ev: ProgressEvent) => any): ng.IHttpPromise<IResponse<IDeletedData>>;
        uploadImageToGallery(request: IUploadMultiImageRequest, progressFn: (ev: ProgressEvent) => any): ng.IHttpPromise<IResponse<IDeletedData>>;
        private getListData<T>(response);
        private getData<T>(response);
    }
}

declare module richstudio {
    class DataUtils {
        static $inject: string[];
        constructor();
    }
}

declare module richstudio {
    interface ICropRect {
        cx: number;
        cy: number;
        cw?: number;
        ch?: number;
        width?: number;
        height?: number;
        rect_size?: number;
    }
}

declare module richstudio {
    interface ImageCropScope extends ng.IScope {
        aspectRatio: string;
        displayHeight: number;
        displayWidth: number;
        scaledHeight: number;
        scaledWidth: number;
        scaledLeft: number;
        scaledTop: number;
        currentImageWidth: number;
        currentImageHeight: number;
        originalImageWidth: number;
        originalImageHeight: number;
        scaleFactor: number;
        imgSrc: string;
    }
}

declare module richstudio {
    interface IImage {
        selected?: boolean;
    }
}

declare module richstudio {
}

declare module richstudio {
}

declare module richstudio {
    interface IRotateScope extends ng.IScope {
        degrees: number;
    }
}

declare module richstudio {
    interface IUploadDialogScope extends ng.IScope {
        fileChange(): void;
    }
    interface IImage {
        file?: File;
    }
    class UploadDialogController {
        private $modalInstance;
        private $scope;
        private management;
        private image;
        static $inject: string[];
        constructor($modalInstance: ng.ui.bootstrap.IModalServiceInstance, $scope: IUploadDialogScope, management: ManagementService, image: IImage);
        activate(): void;
        upload($files: File[], $file: File): void;
        editImage(): void;
        selectFormGallery(): void;
    }
}

declare module richstudio {
    class UploaderDialogController {
        private $modalInstance;
        private dataService;
        private uploadRequest;
        private $scope;
        static $inject: string[];
        progressPercentage: number;
        constructor($modalInstance: ng.ui.bootstrap.IModalServiceInstance, dataService: RichStudioDataService, uploadRequest: any, $scope: ng.IScope);
    }
}

declare module richstudio {
}
