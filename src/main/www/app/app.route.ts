/**
 * Created by BHAlrM on 8/7/2015 AD.
 */
module app{

    class Routing {
        static  $inject:string[] = ['$routeProvider'];

        constructor(private $routeProvider:ng.route.IRouteProvider) {
            $routeProvider
                .when('/', {redirectTo: '/dashboard/1'})
                .when('/dashboard/:id', {
                    templateUrl: 'app/dashboard/dashboard.template.html',
                    controller: 'DashboardController',
                    controllerAs: 'vm'
                })
                .when('/product', {
                    templateUrl: 'app/product/product.template.html',
                    controller: 'ProductController',
                    controllerAs: 'vm'
                })
                .otherwise({redirectTo: '/'})
            ;
        }
    }
    
    
    angular.module('app').config(Routing);
}


