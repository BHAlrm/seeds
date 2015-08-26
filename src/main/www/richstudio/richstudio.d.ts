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
    enum eViewAction {
        NEXT = 0,
        PREVIOS = 1,
        CLOSE = 2,
    }
    interface IImageManagementDialogRequest {
        operatedImage?: IImage;
    }
    interface IViewDialogRequest extends IImageManagementDialogRequest {
        imageList?: IImage[];
    }
    interface IUploadDialogRequest extends IImageManagementDialogRequest {
        isMultiFileSelection: boolean;
    }
    class ManagementService {
        private $modal;
        private $window;
        static $inject: string[];
        constructor($modal: ng.ui.bootstrap.IModalService, $window: ng.IWindowService);
        openViewDialog(request: IViewDialogRequest): ng.IPromise<any>;
        openRenameDialog(request: IImageManagementDialogRequest): ng.IPromise<string>;
        openCropDialog(request: IImageManagementDialogRequest): ng.IPromise<ICropRect>;
        openRotateDialog(request: IImageManagementDialogRequest): ng.IPromise<number>;
        openUploadDialog(request: IUploadDialogRequest): ng.IPromise<File[]>;
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
        image_file_name?: string;
        image_file_dir?: string;
        image_width?: string;
        image_height?: string;
        image_url?: string;
        image_create_time?: string;
        image_update_time?: string;
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
        image_file: Blob;
        txt_crop_rect_json: string;
        txt_rotate_degree?: number;
    }
    interface IUploadMultiImageRequest {
        "image_files[]": Blob[];
        txt_imagegallery_id: string;
    }
    interface IImageManagementRequest {
        txt_image_id: string;
    }
    interface IEditImageRequest extends IImageManagementRequest {
        txt_image_title: string;
    }
    interface ICropImageRequest extends IImageManagementRequest {
        txt_crop_json: string;
    }
    interface IRotateImageRequest extends IImageManagementRequest {
        txt_rotate_degree: number;
    }
    interface IDeleteImageRequest {
        txt_delete_json: string;
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
        deleteImages(request: IDeleteImageRequest): ng.IHttpPromise<IResponse<IDeletedData>>;
        editImage(request: IEditImageRequest): ng.IHttpPromise<IResponse<IDeletedData>>;
        cropImage(request: ICropImageRequest): ng.IHttpPromise<IResponse<IDeletedData>>;
        rotateImage(request: IRotateImageRequest): ng.IHttpPromise<IResponse<IDeletedData>>;
        uploadImage(request: IUploadImageRequest): ng.IHttpPromise<IResponse<IDeletedData>>;
        uploadImageToGallery(request: IUploadMultiImageRequest, progressFn: (ev: ProgressEvent) => any): ng.IHttpPromise<IResponse<IDeletedData>>;
        private getListData<T>(response);
        private getData<T>(response);
        private formEncrypting(obj);
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
        private request;
        static $inject: string[];
        private operatedImage;
        private isMultiFileSelection;
        constructor($modalInstance: ng.ui.bootstrap.IModalServiceInstance, $scope: IUploadDialogScope, management: ManagementService, request: IUploadDialogRequest);
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
        progressFn: (e: ProgressEvent) => void;
        uploadFn: (xhr: XMLHttpRequestEventTarget) => void;
    }
}

declare module richstudio {
}
