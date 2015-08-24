/**
 * Created by BHAlrM on 8/7/2015 AD.
 */
module app{

    class Routing {
        static  $inject:string[] = ['$routeProvider'];

        constructor(private $routeProvider:ng.route.IRouteProvider) {
            $routeProvider
                .when('/', {redirectTo: '/dashboard'})
                .when('/dashboard', {
                    templateUrl: 'app/dashboard/dashboard.template.html',
                    controller: 'DashboardController',
                    controllerAs: 'vm'
                })
                .when('/gallerylist/:id', {
                    templateUrl: 'app/gallerylist/gallerylist.template.html',
                    controller: 'GalleryListController',
                    controllerAs: 'vm'
                })
                .when('/gallery/:id', {
                    templateUrl: 'app/gallery/gallery.template.html',
                    controller: 'GalleryController',
                    controllerAs: 'vm'
                })
                .when('/product', {
                    templateUrl: 'app/product/product.template.html',
                    controller: 'ProductController',
                    controllerAs: 'vm'
                })
                .when('/uploadToGallery', {
                    templateUrl: 'app/uploadToGallery/uploadToGallery.template.html',
                    controller: 'UploadToGalleryController',
                    controllerAs: 'vm'
                })
                .otherwise({redirectTo: '/'})
            ;
        }
    }
    
    
    angular.module('app').config(Routing);
}


