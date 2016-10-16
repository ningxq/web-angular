
angular.module("app.subject",["ng","ngRoute"])
    .controller("subjectCheckController",["$routeParams","subjectService","$location",
        function ($routeParams,subjectService,$location) {
            var id = $routeParams.id;
            var checkState = $routeParams.checkState;
            subjectService.checkSubject(id,checkState,function (data) {
                alert(data);
                $location.path("/AllSubject/a/0/b/0/c/0/d/0");
            })
    }])
    .controller("subjectDelController",["$scope","$location","subjectService","$routeParams",
        function ($scope,$location,subjectService,$routeParams) {
            var flag = confirm("确定删除吗？");
            if(flag){
                var id = $routeParams.id;
                subjectService.delSubject(id,function (data) {
                    alert(data);
                    //页面发生跳转
                    $location.path("/AllSubject/a/0/b/0/c/0/d/0");
                })
            }else{
                $location.path("/AllSubject/a/0/b/0/c/0/d/0");
            }
        //var id = $scope.subject.id;
        //console.log(id);

    }])
    .controller("subjectController",["$scope","$location","commonService","subjectService","$routeParams",function ($scope,$location,commonService,subjectService,$routeParams) {
           $scope.addSubject = function () {
              $location.path("/addSubject");
            };
            //将路由参数绑定到作用域中
            $scope.params=$routeParams;
            //添加页面绑定的对象
                $scope.subject={
                    typeId:3,
                    levelId:1,
                    departmentId:1,
                    topicId:2,
                    stem:'',
                    answer:'',
                    fx:'',
                    choiceContent:[],
                    choiceCorrect:[false,false,false,false]
                };
                $scope.save=function () {
                    subjectService.saveSubjects($scope.subject,function (data) {
                      // console.log(data);
                     var subject={
                            typeId:3,
                            levelId:1,
                            departmentId:1,
                            topicId:2,
                            stem:'',
                            answer:'',
                            fx:'',
                            choiceContent:[],
                            choiceCorrect:[false,false,false,false]
                        };
                        angular.copy(subject,$scope.subject);
                    })
                };
                $scope.saveAndClose=function () {
                    subjectService.saveSubjects($scope.subject,function (data) {
                        $location.path("/AllSubject/a/0/b/0/c/0/d/0");
                    })
                }
            // $scope.filterType = function (index) {
            //     if(index==0){
            //         $scope.all=true;
            //     }else
            //         $scope.all=false;
            //         $scope.index=index;
            // };
        //获取所有题目类型,难度级别，方向，知识点
        commonService.getAllTypes(function (data) {
            $scope.types=data;
        });
        commonService.getAllDepartments(function (data) {
            $scope.departments=data;
        });
        commonService.getAllLevels(function (data) {
            $scope.levels=data;
        });
        commonService.getAllTopicss(function (data) {
            $scope.topics=data;
        });

         //获取所有题目信息
        subjectService.getAllSubjects($routeParams,function (data) {
           // console.log(data);

            data.forEach(function (subject) {
                var answer=[];
                //为每个选项添加A B C D
                subject.choices.forEach(function (choice,index) {
                   choice.no= commonService.convertIndexToNo(index);
                });
                //当当前题目类型为单选或者多选的时候，修改subject  answer
                    if( subject.subjectType.id!=3){
                        subject.choices.forEach(function (choice) {
                            if(choice.correct){
                                answer.push(choice.no);
                            }
                        });
                        //修改当前题目的answer
                        subject.answer=answer.toString();
                    }
                    if(subject.subjectType!=null){
                        $scope.subjects=data;
                    }
            });
        });
    }])

    .config(["$routeProvider",function ($routeProvider) {
        $routeProvider.when("/addSubject",{
            templateUrl:"tpl/subject/subjectAdd.html",
            controller:"subjectController"
        })
    }])
    .service("subjectService",["$http","$httpParamSerializer",function ($http,$httpParamSerializer) {
        this.checkSubject=function (id,checkState,handler) {
            $http.get("http://172.16.0.5:7777/test/exam/manager/checkSubject.action",{
                params:{
                    'subject.id':id,
                    'subject.checkState':checkState
                }
            }).success(function (data) {
                handler(data);
            })
        };
        
        this.delSubject=function (id,handler) {
            $http.get("http://172.16.0.5:7777/test/exam/manager/delSubject.action",{
                params:{
                    'subject.id':id
                }
            }).success(function (data) {
                handler(data);
            })
        };
        this.saveSubjects=function (params,handler) {
           // console.log(params);
            //处理数据
            var data = {};
            for(var key in params){
                var val = params[key];
                switch(key){
                    case"typeId":data['subject.subjectType.id']=val;break;
                    case"levelId":data['subject.subjectLevel.id']=val;break;
                    case"departmentId":data['subject.department.id']=val;break;
                    case"topicId":data['subject.topic.id']=val;break;
                    case"stem":data['subject.stem']=val;break;
                    case"answer":data['subject.answer']=val;break;
                    case"fx":data['subject.analysis']=val;break;
                    case"choiceContent":data['choiceContent']=val;break;
                    case"choiceCorrect":data['choiceCorrect']=val;break;
                }
            }
            //对data对象进行表单格式的序列化操作（默认使用json格式）
            data=$httpParamSerializer(data);
            $http.post("http://172.16.0.5:7777/test/exam/manager/saveSubject.action",data,{
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                }
            }).success(function (data) {
                handler(data);
            })
        };
        this.getAllSubjects=function (params,handler) {
            //循环遍历params，将params转换为后台需要的对象
            var data ={};
            for(var key in params){
                var val = params[key];
                if(val!=0){
                    switch(key){
                        case"a":
                        data['subject.subjectType.id']=val;
                        break;
                        case"b":
                        data['subject.subjectLevel.id']=val;
                        break;
                        case"c":
                            data['subject.department.id']=val;
                            break;
                        case"d":
                            data['subject.topic.id']=val;
                            break;
                    }
                }
            }
            $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjects.action",{
                params:data
            }).success(function (data) {
            //$http.get("data/subjects.json").success(function (data) {
                handler(data);
            })
        };
    }])
    .factory("commonService",["$http",function ($http) {
        return{
            convertIndexToNo:function (index) {
                  return  index=="0"?"A ":(index=="1"?"B ":(index=="2"?"C ":(index=="3"?"D ":"E ")));
            },
            getAllTypes:function (handler) {
                 $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectType.action").success(function (data) {
                     // $http.get("http://192.168.2.100:8080/test/exam/manager/getAllSubjectType.action").success(function (data) {
               // $http.get("data/types.json").success(function (data) {
                    handler(data);
                });

            },
            getAllDepartments:function (handler) {
                $http.get("http://172.16.0.5:7777/test/exam/manager/getAllDepartmentes.action").success(function (data) {
                    // $http.get("http://192.168.2.100:8080/test/exam/manager/getAllDepartmentes.action").success(function (data) {
                    //  $http.get("data/departments.json").success(function (data) {
                    handler(data);
                });

            }, getAllTopicss:function (handler) {
               $http.get("http://172.16.0.5:7777/test/exam/manager/getAllTopics.action").success(function (data) {
                   //$http.get("http://192.168.2.100:8080/test/exam/manager/getAllTopics.action").success(function (data) {
                     // $http.get("data/topics.json").success(function (data) {
                    handler(data);
                });

            }, getAllLevels:function (handler) {
                  $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectLevel.action").success(function (data) {
                      // $http.get("http://192.168.2.100:8080/test/exam/manager/getAllSubjectLevel.action").success(function (data) {
                    //  $http.get("data/levels.json").success(function (data) {
                    handler(data);
                });

            }
        };
    }]).filter("selectTopics",function () {
    return function (input,id) {
        // console.log(input);
        // console.log(id);
        //input 为要过滤的内容，id是方向id
        if(input){
            //Array.prototype.filter进行过滤
            var result= input.filter(function (item) {
                return item.department.id==id;
            });
            return result;
        }
    }
    }).directive("selectOption",function () {
            return{
                restrict:"A",
                link:function (scope,element) {
                  //  console.log(element);element是jquery对象，为当前元素
                    element.on("change",function () {
                        var type = $(this).attr("type");
                        var val = $(this).val();
                        var isCheck = $(this).prop("checked");
                        //设置值
                        if(type=="radio"){
                            scope.subject.choiceCorrect=[false,false,false,false];
                            for(var i=0;i<4;i++){
                               if(i==val)
                                scope.subject.choiceCorrect[i]=true;
                            }
                        }else if(type=="checkbox"&& isCheck){
                            for(var i=0;i<4;i++){
                                if(i==val)
                                    scope.subject.choiceCorrect[i]=true;
                            }
                        }else if(type=="checkbox"&& !isCheck){
                            for(var i=0;i<4;i++){
                                if(i==val)
                                    scope.subject.choiceCorrect[i]=false;
                            }
                        }
                        //强制消化
                        scope.$digest();
                    });

                }
            }
})