/**
 * Created by shiva on 2/23/2015.
 */
var directives = angular.module('olympic.directives', []);
directives.directive('olympicsworldmap', function () {
    return {
        restrict: 'EAC',
        link: function ($scope, element, $attr) {
            var value = $attr.mydata,
                colMin = $attr.colormin,
                colMax = $attr.colormax;
            $scope.$watch("" + value, function (n, o) {
                element.empty();
                $(element).width('auto');
                $(element).height(400);
                $(element).vectorMap({
                    backgroundColor: "#fff",
                    regionStyle: {
                        initial: {
                            fill: '#e4e4e4',
                            "fill-opacity": 1,
                            stroke: 'none',
                            "stroke-width": 0,
                            "stroke-opacity": 1
                        }
                    },
                    series: {
                        regions: [{
                            values: $scope["" + value],
                            // scale: ["#81E7FF", "#00485A"],
                            scale: [colMin, colMax],
                            normalizeFunction: 'polynomial'
                        }]
                    },
                    onRegionLabelShow: function (e, el, code) {
                        if (isNaN($scope["" + value][code])) {
                            el.html(el.html() + ' : ' + 0 + ' ' + $attr.type + ' Medals');
                        } else {
                            el.html(el.html() + ' : ' + $scope["" + value][code] + ' ' + $attr.type + ' Medals');
                        }
                    }
                });
            });
        }
    };
});