//You're missing a delete functionality for each of your tweets. Also, remove console logs that are specifc to just debugging. Good naming of the different functions and variables.
var $postForm = $("#twet-post-form");
var $loginForm = $("#login-form");
var $templateLi = $('#template-li');
var $twetList = $('#twet-list');

var currentUser;

// grab current user and store it in locals
$.get('user', function(data, status) {
  currentUser = data;
});

// .done function for twet posting
var onSuccessfulPost = function(data, status) {
  var body = data.bodyText;
  var author = data.user;
  var authorId = data.userId;

  var $newTwet = $templateLi.clone();
  $newTwet.attr('id',data._id);
  $newTwet.find('.body').html(body);
  $newTwet.find('.author').html(author);
  $newTwet.find('.hidden-id-tag').html(authorId);
  console.log($newTwet);

  $twetList.prepend($newTwet);
};

// changes window display to dash on login
var onSuccessfulLogin = function(data, status) {
  window.location.href = "/";
};

// error catching
var onError = function(data, status) {
  console.log("status", status);
  console.log("error", data);
};

// defines behavior of login/logout button
$("#login-logout").click(function() {
  if (!currentUser) {
    window.location.href = "/login";
  }
  else {
    $.get('logout');
    window.location.href=  "/login";
  }
});

// defines on click behavior for user list entries
$('#user-list').on('click', 'li', function() {
  var userId = $(this).attr('id');
  $('#twet-list li').css("background-color", "#E8E8E8");
  $('#twet-list li').find('p.hidden-id-tag').filter(':contains(' + userId + ')')
  .each(function (ind,obj) {
    $(this).parent().css("background-color", '#00CCFF');
  });
});

// defines behavior of login submission form
$loginForm.submit(function(event) {
  event.preventDefault();
  var username = $loginForm.find("[name='username']").val();
  var password = $loginForm.find("[name='password']").val();
  $loginForm.find("[name='username']").val('');
  $loginForm.find("[name='password']").val('');
  $.post("login", {
    username: username,
    password: password
  })
    .done(onSuccessfulLogin)
    .error(onError);
});

// defines behavior for post form/buttom
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
    .done(onSuccessfulPost)
    .error(onError);
});
