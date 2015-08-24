/**
 * Created by BHAlrM on 8/12/2015 AD.
 */
module richstudio {

    export interface IUploadDialogScope extends ng.IScope {
        fileChange():void;
    }
    
    export interface IImage{
        file?:File
    }
    
    export class UploadDialogController {
        
        static $inject:string[] = ['$modalInstance', '$scope', 'management', 'image'];
        
        constructor(private $modalInstance:ng.ui.bootstrap.IModalServiceInstance,
                    private $scope:IUploadDialogScope,
                    private management:ManagementService,
                    private image:IImage) {
            this.activate();
        }

        public activate() {


        }

        public upload($files:File[], $file:File) {
            if($files.length === 0) return;

            this.$modalInstance.close($files);

            //var fr = new FileReader();
            //angular.forEach($files, (file:File)=>{
            //    fr.readAsDataURL(file);
            //});
            //
            //fr.onload = (e:Event)=> {
            //    this.$scope.$apply(() => {
            //        var fileReader = <FileReader>e.target;
            //        
            //        if(this.image){
            //            this.image.image_url = fileReader.result;
            //            this.image.file = $file[0];
            //        }else{
            //            
            //        }
            //      
            //    });
            //};
            
        }

        public editImage() {
            this.management.openViewDialogWithImage(this.image);
        }

        public selectFormGallery() {
            this.$modalInstance.close('select');
        }

    }

    angular.module('richstudio.management').controller('UploadDialogController', UploadDialogController);
}