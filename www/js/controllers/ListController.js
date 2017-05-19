.controller('ListController', ['$scope', '$firebaseArray', '$firebaseObject', 'FBURL', function($scope, $firebaseArray, $firebaseObject, FBURL){

  var products = new Firebase(FBURL);
  $scope.products = $firebaseArray(products);

  $scope.removeProduct = function(id) {
    var ref = new Firebase(FBURL + id);
    var product = $firebaseObject(ref)
    product.$remove();
   };

}])
