/**
 * Created by shiva on 2/25/2015.
 */
var directives = angular.module('olympic.MorrisDirectives',[]);
directives.directive('customdonutchart',function() {
    function createChart(element,$attrs) {
        console.log("In Morris Directive, data :" );
        console.log($attrs.mydata);
        var data1 = ($attrs.mydata);
       // data2 = [{"label":"gold","value":10},{"label":"silver","value":8},{"label":"bronze","value":5}];
var data2 = [];
        var data3 = null;
        data3 = $.parseJSON(data1);
        for(var i in data1){
            var item = {};
            item.label = i.label;
            item.value = Number(i.value);
            data2.push(item);
        }
        console.log("data2 : ");
        console.log(data2);
        var r = new Morris.Donut({
            element: element,
            resize: true,
            colors: ['#ffaa00', '#C0C0C0', '#d66932'],
            data: data3,
            hideHover: 'auto'
        });
        return r;
    }
    return {
        restrict: 'AEC',
        replace: true,
        link: function ($scope, element, $attrs) {
            element.empty();
            $(element).width('auto');
            $(element).height(200);

            return createChart(element,$attrs);
                //var chart2 = Morris.Donut({
                //    element: element,
                //    resize: true,
                //    colors: ['#71d033', '#f56954', '#707070'],
                //    data: data2,
                //    hideHover: 'auto'
                //});
           // $(element).chart2();

        }
    };
});