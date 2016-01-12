'use strict';
(function(){

var task =angular.module('task',[]);

task.factory('Task',function(){

	return {

		validEmail:function(input){
			var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    		return re.test(input);
		}
	}

});	/*end task*/

task.factory('Session',function($state,$ionicHistory){

	return {

		isLoggin:function(){
			
			 if (localStorage.getItem("token") === null) {
          		$state.go('login');
        	 }else{
        	 	if ($ionicHistory.currentView().stateName=="login") {
        	 		$state.go('home');
        	 	};
        	 }

		},
		logout:function(){
			localStorage.clear();
      		localStorage.removeItem('token');
      		$state.go('login');
		},
		doBack:function(){
			$ionicHistory.goBack();
		},
		showBarButtons:function(){

			if ($ionicHistory.currentView().stateName=="login") {
				return false;
			}else{
				return true;
			}
		}
	}

});

}());