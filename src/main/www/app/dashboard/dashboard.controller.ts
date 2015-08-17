/**
 * Created by BHAlrM on 8/9/2015 AD.
 */
    
module app{
    
    interface IGallery extends richstudio.IGallery{
        selected?: boolean;
    }
    
    class DashboardController{
        static $inject:string[] = ['RichStudioDataService', 'lodash', '$location'];
        
        private curPage:number;
        private perPage:number;
        private sortBy:string = "none";
        
        private search:IGallery;
        private galleryList:IGallery[];
        
        constructor(private dataService:richstudio.RichStudioDataService, private _:_.LoDashStatic, private $location:ng.ILocationService) {
            this.activate();
        }
        
        
        private activate(){
            this.getGalleryList().then((galleryList: richstudio.IGallery[])=>{
                this.galleryList = galleryList;
            });
            
        }
        
        private getGalleryList(){
            return this.dataService.getGalleryList(1, 10).then((list: richstudio.IList<IGallery>)=>{
                return list.dataList
            });
        }

        public openGallery(id:number){
            this.$location.path('/gallery/' + id);
        }
        
        
        public clearAll(){
            this.setSelect(false);
        }
        
        public selectAll(){
            this.setSelect(true);
        }
        
        private setSelect(isSelectAll:boolean){
            _.each(this.galleryList, (gallery:IGallery)=> {
                gallery.selected = isSelectAll
            });
        }
        
    }
    
    angular.module('app').controller('DashboardController', DashboardController);
}