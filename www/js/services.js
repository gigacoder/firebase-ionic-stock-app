angular.module('starter.services', ['firebase'])

.factory('Auth', Auth);

function Auth(rootRef, $firebaseAuth) {
  return $firebaseAuth(rootRef);
}
Auth.$inject = ['rootRef', '$firebaseAuth'];


