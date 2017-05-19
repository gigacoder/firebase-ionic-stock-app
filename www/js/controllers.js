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
      // console.log(x);
    },function(error) {
      console.log("Error:", error);
    });
  console.log($scope.myCompany);

  $scope.removeProduct = function(id) {
    var ref = new Firebase(FBURL + id);
    var tickers = $firebaseObject(ref);
    console.log(tickers);
    tickers.$remove();
  };
}])


.controller('AddController', ['$scope', '$http', '$firebaseArray', '$location', 'FBURL','FBURLROOT', function($scope, $http, $firebaseArray, $location, FBURL, FBURLROOT){
  $scope.symbol = "";
  $scope.result={};

  $scope.getData = function() {

    var url = "http://query.yahooapis.com/v1/public/yql";
    var symbol = $scope.symbol;
    var data = encodeURIComponent("select * from yahoo.finance.quote where symbol in ('" +$scope.symbol+ "')");
    console.log(data);
    var str1 = url.concat("?q=",data);
    str1=str1.concat("&format=json&diagnostics=true&env=store://datatables.org/alltableswithkeys&callback=");


    $http.get(str1)
    .success(function(data, status, headers, config) {
      	console.table("success data, status="+ JSON.stringify(data) + status);
      console.table(data.query.results);
      if(data.query.results == null) {
        console.log("No Result Found!!")
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










//-----------------------------------
