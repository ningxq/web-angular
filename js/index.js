/**
 * 首页核心js文件
 * **/
$(function () {
    //左侧导航动画效果
    $(".baseUI>li>a").off("click");
    $(".baseUI>li>a").on("click",function () {
        $(".baseUI>li>ul").slideUp();
        $(this).next().slideDown(300);
    });
    //默认收起全部，展示第一个
    $(".baseUI>li>ul").slideUp();
    $(".baseUI>li>a").eq(0).trigger("click");

    //点击li背景颜色变化
    $(".baseUI>li>ul>li").off();//绑定之前先解绑
    $(".baseUI>li>ul>li").on("click",function () {
        $(".baseUI>li>ul>li").removeClass("current");
        $(this).addClass('current');
    });
        //模拟点击
    $(".baseUI>li>ul>li>a").eq(0).trigger("click");
});

//核心模块
angular.module("app",["ng","ngRoute","app.subject","app.paper"])
        //核心模块控制器
        .controller("mainCtrl",["$scope",function ($scope) {
            
        }]).config(["$routeProvider",function ($routeProvider) {
            /**
             * a 类型id
             * b 难度ID
             * c 方向id
             * d 知识点id
             * **/
            $routeProvider.when("/AllSubject/a/:a/b/:b/c/:c/d/:d", {
                templateUrl:"tpl/subject/subjectList.html",
                controller:"subjectController"
            }).when("/SubjectDel/id/:id", {
                templateUrl:"tpl/subject/subjectList.html",
                controller:"subjectDelController"
            }).when("/SubjectCheck/id/:id/checkState/:checkState", {
                templateUrl:"tpl/subject/subjectList.html",
                controller:"subjectCheckController"
            }).when("/PaperList/title/:title/des/:des/dept/:dept/at/:at/top/:top", {
                templateUrl:"tpl/paper/paperManager.html",
                controller:"paperListController"
            }).when("/PaperAdd/id/:id/title/:title/type/:type/topic/:topic/level/:level", {
                templateUrl:"tpl/paper/paperAdd.html",
                controller:"paperAddController"
            }).when("/PaperSubjectList/a/:a/b/:b/c/:c/d/:d", {
                templateUrl:"tpl/paper/subjectList.html",
                controller:"subjectController"
            });
        }]);