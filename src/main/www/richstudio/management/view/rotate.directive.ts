/**
 * Created by BHAlrM on 8/13/2015 AD.
 */
module richstudio {

    export interface IRotateScope extends ng.IScope{
        degrees: number
    }
    
    function rotateDirectiveFactory():ng.IDirective {

        var directive = {
            restrict: 'A',
            link: link,
            scope: {
                rotate: '='
            }
        };

        return directive;

        /////////////////

        function link(scope:IRotateScope, element:ng.IAugmentedJQuery) {
            
            scope.$watch('rotate',  (rotateDegrees:number) => {
                if(angular.isNumber(rotateDegrees)){
                    console.log(rotateDegrees);
                    var r = 'rotate(' + rotateDegrees + 'deg)';
                    element.css({
                        '-moz-transform': r,
                        '-webkit-transform': r,
                        '-o-transform': r,
                        '-ms-transform': r
                    });
                }
            });
            
        }
    }

    angular.module('richstudio.management').directive('rotate', rotateDirectiveFactory);
}