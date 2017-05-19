angular.module('starter.controllers', ['firebase'])

.controller('LoginCtrl', LoginCtrl)

.controller('DashCtrl', function($scope){


})
.controller('ListController', ['$scope', '$firebaseArray', '$firebaseObject', 'FBURL', function($scope, $firebaseArray, $firebaseObject, FBURL){

  var companyname = new Firebase(FBURL+'/solar');
  console.log(companyname);
  $scope.companyname = $firebaseArray(companyname);

  $scope.removeProduct = function(id) {
    var ref = new Firebase(FBURL + id);
    var ticker = $firebaseObject(ref)
    ticker.$remove();
   };


}])
.controller('AddController', ['$scope', '$http', '$firebaseArray', '$location', 'FBURL', function($scope, $http, $firebaseArray, $location, FBURL){
  //StockCtrl functions
  $scope.symbol = "";
	$scope.result={};





  // Start as not visible but when button is tapped it will show as true

          $scope.visible = false;

      // Create the array to hold the list of Birthdays

          $scope.bdays = [];

      // Create the function to push the data into the "bdays" array

      $scope.newBirthday = function(){

          $scope.bdays.push({name:$scope.bdayname, date:$scope.bdaydate});

          $scope.bdayname = '';
          $scope.bdaydate = '';

      };



	$scope.getData = function() {

	    var url = "http://query.yahooapis.com/v1/public/yql";
	    var symbol = $scope.symbol;
	    var data = encodeURIComponent("select * from yahoo.finance.quotes where symbol in ('" +$scope.symbol+ "')");

	    /*
	    Build the string to use with with $http get to retrieve JSON data from Yahoo Finance API
		Required format is:
	    http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20('aapl')&format=json&diagnostics=true&env=http://datatables.org/alltables.env
	   	*/
	   	var str1 = url.concat("?q=",data);
	   	str1=str1.concat("&format=json&diagnostics=true&env=http://datatables.org/alltables.env");


	    $http.get(str1)

	    .success(function(data, status, headers, config) {
	    //	console.table("success data, status="+ JSON.stringify(data) + status);
      console.table(data.query.results);
	    	if(data.query.results == null) {
	    		console.log("No Valid Results could be Returned!!")
	    	}
	    	else {
		        $scope.result.Name = "Name: " + data.query.results.quote.Name;
		        $scope.result.Exchange = "Exchange: " + data.query.results.quote.StockExchange;
		        $scope.result.MarketCap = "MarketCap: " + data.query.results.quote.MarketCapitalization;
		        $scope.result.LastPrice = "Bid Price: " + data.query.results.quote.LastTradePriceOnly;
		        $scope.result.PercentChange = "% Change: " + data.query.results.quote.PercentChange;
		        $scope.result.YearRange = "Year Range: " + data.query.results.quote.YearRange;
		    }
	    })

	    .error(function(data, status, headers, config) {
	        var err = status + ", " + data;
	            $scope.result = "Request failed: " + err;
	    });
	}



	$scope.addProduct = function() {
		var ref = new Firebase(FBURL+'/solar');
    // var newMessageRef = messageListRef.push();
    // newMessageRef.set({ 'user_id': 'fred', 'text': 'Yabba Dabba Doo!' });
    // var path = newMessageRef.toString();



		var companyticker = $firebaseArray(ref);
		companyticker.$add({
			Name: $scope.result.Name,
			Price: $scope.result.LastPrice,
      Category: $scope.result.Category
		});

		$location.path('/tab/dash');
	};
  $scope.tickercategories = [
    {name:'Bio Stock', level:'1'},
    {name:'Solar', level:'2'},
    {name:'Others', level:'3'}
  ];

}])




.controller('EditController', ['$scope','$location', '$stateParams', '$firebaseObject', 'FBURL',
    function($scope, $location, $stateParams, $firebaseObject, FBURL){

    var ref = new Firebase(FBURL + $stateParams.id);
		$scope.companyname = $firebaseObject(ref);
    console.log($scope.companyname);

    $scope.editProduct = function() {
        $scope.companyname.$save({
            name: $scope.companyname.Name,
            price: $scope.companyname.LastPrice,
        });
        $scope.edit_form.$setPristine();
        $scope.companyname = {};
        $location.path('/tab/dash');
    };

}])









.controller('ChatsCtrl', ChatsCtrl)

.controller('ChatDetailCtrl', ChatDetailCtrl)

.controller('AccountCtrl', AccountCtrl);

function LoginCtrl(Auth, $state) {

  this.loginWithGoogle = function loginWithGoogle() {
    Auth.$authWithOAuthPopup('google')
      .then(function(authData) {
        $state.go('tab.dash');
      });
  };

}
LoginCtrl.$inject = ['Auth', '$state'];

function DashCtrl() {}

function ChatsCtrl($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
}
ChatsCtrl.$inject = ['$scope', 'Chats'];

function ChatDetailCtrl($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
}
ChatDetailCtrl.$inject = ['$scope', '$stateParams', 'Chats'];

function AccountCtrl($scope) {
  $scope.settings = {
    enableFriends: true
  };
}
AccountCtrl.$inject = ['$scope'];








//-----------------------------------
