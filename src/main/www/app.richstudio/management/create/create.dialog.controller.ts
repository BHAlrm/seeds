/**
 * Created by BHAlrM on 8/11/2015 AD.
 */
module app.richstudio {
    class CreateGalleryDialogController {
        static $inject:string[] = ['$modalInstance', 'request', 'RichStudioDataService', 'notify'];

        private name:string;
        private title:string;
        private description:string;
        private formCreateGallery:ng.IFormController;

        constructor(private $modalInstance:ng.ui.bootstrap.IModalServiceInstance,
                    private request:IImageManagementDialogRequest,
                    private dataService:RichStudioDataService,
                    private notify:ng.cgNotify.INotifyService) {
            this.activate();
        }

        public activate() {
            this.name = '';
            this.title = '';
            this.description = '';
        }

        public resolve() {
            if(this.formCreateGallery.$valid){
                var request:ICreateGalleryRequest = {
                    txt_name: this.name,
                    txt_title: this.title,
                    txt_description: this.description
                };
                this.dataService.addGallery(request).then(()=>{
                    this.notify({message:'successfully create gallery', classes: 'alert alert-success'});
                    this.$modalInstance.close();
                }, ()=>{
                    this.notify({message:'successfully create gallery', classes: 'alert alert-danger'});
                });
                
            }else{
                this.notify({message:'missing required field', classes: 'alert alert-danger'})
            }
        }

        public dismiss() {
            this.$modalInstance.dismiss();
        }


    }


    angular.module('app.richstudio.management').controller('CreateGalleryDialogController', CreateGalleryDialogController);
}
