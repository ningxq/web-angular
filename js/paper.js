/**
 * Created by hudd on 2016/9/28.
 * 试卷模块
 */
angular.module("app.paper",["ng","app.subject"])
    //试卷查询控制器
        .controller("paperListController",["$scope","commonService","paperService",
            function ($scope,commonService,paperService) {

        }])
    //试卷添加控制器
         .controller("paperAddController",["$scope","commonService","paperModel","$routeParams","paperService","$location",
             function ($scope,commonService,paperModel,$routeParams,paperService,$location) {
             commonService.getAllDepartments(function (data) {
                 //将全部方向绑定到作用域dps中
                 $scope.dps=data;
             });
              //双向绑定的模板
             $scope.pmodel=paperModel.model;
             var paramId = $routeParams.id;
                 if(paramId!=0){
                     //将要添加的题目的id添加到数组中
                     paperModel.getSubjectIds(paramId);
                     paperModel.getSubjects(angular.copy($routeParams));
                 }
            $scope.savePaper=function () {
                paperService.savePaper($scope.pmodel,function (data) {
                    alert(data);
                    $location.path("/PaperList/");
                })
            }

         }])
    //试卷删除控制器
        .controller("paperDelController",["$scope",function ($scope) {

        }])
        .factory("paperModel",function () {
            return{
                    model:{
                        departmentId:1,//所属方向
                        title:'',  //试卷名称
                        description:'',//试卷描述
                        totalPoints:'',//总分
                        answerQuestionTime:'',//考试时间
                        subjectIds:[],//题目id
                        subjects:[],//题目信息
                        scores:[]//每个题目的分值
                    },
                    getSubjectIds:function (params) {
                        return this.model.subjectIds.push(params);
                    },
                    getSubjects:function (params) {
                        return this.model.subjects.push(params);
                    }
            }
        })
        .service("paperService",["$http","$httpParamSerializer",function ($http,$httpParamSerializer) {
            this.savePaper=function (params,handler) {
                //处理数据
                var obj = {};
                for(var key in params){
                    var val = params[key];
                    switch(key){
                        case"departmentId":obj['paper.department.id']=val;break;
                        case"title":obj['paper.title']=val;break;
                        case"description":obj['paper.description']=val;break;
                        case"totalPoints":obj['paper.totalPoints']=val;break;
                        case"answerQuestionTime":obj['paper.answerQuestionTime']=val;break;
                        case"subjectIds":obj['subjectIds']=val;break;
                        case"scores":obj['scores']=val;break;
                    }
                }
                obj = $httpParamSerializer(obj);
                $http.post("http://172.16.0.5:7777/test/exam/manager/saveExamPaper.action",obj,{
                    headers:{
                        "Content-Type":"application/x-www-form-urlencoded"
                    }
                }).success(function (data) {
                    handler(data);
                })

            }
        }])