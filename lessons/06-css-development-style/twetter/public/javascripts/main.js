var $postForm = $("#twet-post-form");
var $loginForm = $("#login-form");
var $templateLi = $('#template-li');
var $twetList = $('#twet-list');

var currentUser;

var onSuccess = function(data, status) {
  var body = data.bodyText;
  var author = data.user;

  var $newTwet = $templateLi.clone();
  $newTwet.attr('id',data._id);
  $newTwet.find('.body').html(body);
  $newTwet.find('.author').html(author);
  console.log($newTwet);

  $twetList.prepend($newTwet);
};


var onSuccessfulLogin = function(data, status) {
  window.location.href = "/main";
};


var onError = function(data, status) {
  console.log("status", status);
  console.log("error", data);
};


$("#login-logout").click(function() {
  if (!currentUser) {
    window.location.href = "/";
  }
  else {
    currentUser = undefined;
    window.location.href = "/main";
  }
});

$loginForm.submit(function(event) {
  event.preventDefault();
  var username = $loginForm.find("[name='username']").val();
  $loginForm.find("[name='username']").val('');
  $.post("login", {
    username: username
  })
    .done(onSuccessfulLogin)
    .error(onError);
});

$postForm.submit(function(event) {
  event.preventDefault();
  var body = $postForm.find("[name='twet']").val();
  $postForm.find("[name='twet']").val('');
  var author = currentUser;
  $.post("post", {
    bodyText: body,
    user: author.username,
    userId: author._id
  })
    .done(onSuccess)
    .error(onError);
});
