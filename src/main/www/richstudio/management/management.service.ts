/**
 * Created by BHAlrM on 8/7/2015 AD.
 */

module richstudio{
    export enum eUploadAction{
        UPLOAD, EDIT, SELECT_FROM_GALLERY
    }
    export interface IUploadAction{
        action: eUploadAction,
        image: IEditedImage
    }
    
   export class ManagementService{
       static $inject:string[] = ['$modal'];

       constructor(private $modal:ng.ui.bootstrap.IModalService) {
       }
       
       public openViewDialog(image?:IEditedImage):angular.IPromise<IEditedImage>{
           var modalOptions = {
               templateUrl: 'richstudio/management/view/view.template.html',
               controller: 'ViewImageDialogController',
               controllerAs: 'dialog',
               resolve:{
                   image: function(){return image}
               }
           };
           
           return this.$modal.open(modalOptions).result;
       }
       
       
       public openUploadDialog(image:IEditedImage):ng.IPromise<IEditedImage>{
           var modalOptions = {
               templateUrl: 'richstudio/management/upload/upload.dialog.template.html',
               controller: 'UploadDialogController',
               controllerAs: 'dialog',
               resolve:{
                   image: function(){return image}
               }
           };
            
           return this.$modal.open(modalOptions).result.then((upload:IUploadAction)=>{
               
               switch (upload.action){
                   case eUploadAction.EDIT:
                       return this.openViewDialog(upload.image);
                       break;
                   case eUploadAction.UPLOAD:
                       return upload.image;
                       break;
                   default :
                       return upload.image;
                       break;
               }
           });
       }
       
   }
    
    angular.module('richstudio.management').service('management', ManagementService);
}