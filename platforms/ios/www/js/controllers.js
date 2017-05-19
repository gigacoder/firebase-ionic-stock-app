angular.module('starter.controllers', ['firebase'])

.controller('LoginCtrl', LoginCtrl)

.controller('DashCtrl', function($scope){
})


.controller('ListController', ['$scope', '$firebaseArray', '$firebaseObject', 'FBURLROOT', 'FBURL', function($scope, $firebaseArray, $firebaseObject, FBURLROOT, FBURL){

  var companyname = new Firebase(FBURL);
  $scope.myCompany = $firebaseArray(companyname);

  $scope.myCompany.$loaded(
    function(x) {
      x === $scope.myCompany; // true
      console.log(x);
    },function(error) {
      console.log("Error:", error);
    });


  // $scope.myCompany.$on('loaded', function(){
  //   console.log('$scope.myCompany loaded', $scope.myCompany );
  // });
  // console.log($scope.myCompany);

  // var ref = new Firebase('https://katowulf-angularfire-fiddle.firebaseio-demo.com');
  //    $scope.name = $firebase(ref)
  //    $scope.name.$on('loaded', function() {
  //       console.log('$scope.name loaded', $scope.name);
  //     });


  $scope.removeProduct = function(id) {
    var ref = new Firebase(FBURL + id);
    var tickers = $firebaseObject(ref);
    console.log(tickers);
    tickers.$remove();
  };




}])

.controller('AddController', ['$scope', '$http', '$firebaseArray', '$location', 'FBURL','FBURLROOT', function($scope, $http, $firebaseArray, $location, FBURL, FBURLROOT){
  //StockCtrl functions
  $scope.symbol = "";
  $scope.result={};

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

    var ref = new Firebase(FBURL);
    var companyticker = $firebaseArray(ref);



    companyticker.$add({
      Name: $scope.result.Name,
      Price: $scope.result.LastPrice,
      Category: $scope.result.Category
    });
    $location.path('/tab/dash');
  };


  var portfolioRef = new Firebase(FBURLROOT+'/myPortfolio');
  $scope.portfolioCategory = $firebaseArray(portfolioRef);
  // $scope.messages = $firebaseArray(portfolioRef);








  //   $scope.tickercategories = [
  //   {name:'Bio Stock', level:'1'},
  //   {name:'Solar', level:'2'},
  //   {name:'Others', level:'3'}
  // ];

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


.controller('PopupCtrl', ['$scope', '$http', '$firebaseArray', '$location', 'FBURL','FBURLROOT', '$ionicPopup' , '$timeout', function($scope, $http, $firebaseArray, $location, FBURL, FBURLROOT, $ionicPopup, $timeout){

  // Triggered on a button click, or some other target
  $scope.showPopup = function() {
    $scope.data = {};
    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/portfolio.html',
      scope: $scope,
    });
    $scope.popupclose = function() {
      myPopup.close();
    };
  }
}])

.controller('PortfolioController', ['$scope', '$http', '$firebaseArray', '$location', 'FBURL','FBURLROOT', '$ionicPopup' , '$timeout', function($scope, $http, $firebaseArray, $location, FBURL, FBURLROOT, $ionicPopup, $timeout){

  var ref = new Firebase(FBURLROOT+'/myPortfolio');
  $scope.categoryList = $firebaseArray(ref);

  $scope.addMessage = function() {
    $scope.categoryList.$add({
      text: $scope.newMessageText
    });

    $scope.addPortfolio.newMessageText.$setPristine();
    $scope.addPortfolio.newMessageText.$setPristine(true);
    $scope.newMessageText = '';
  };

}])



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
