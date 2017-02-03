var $form = $("#ajax-form");

var onSuccess = function(data, status) {
  var item = ("<li><div id=" + data._id + "><span class='name'>" + data.name + "</span> - price:\
  $<span class='price'>" + data.price + "</span>, in stock: <span class='stockstate'>" + data.inStock + "</span>\
  <button class='stock' type='button'><span class='stockbutton'>Out-of-Stock</span></button>\
  <form class='edit-form' action='edit' method='POST'>\
    Name: <input type='text' name='name'/><br/>\
    Price: <input type='number' name='price'/><br/>\
    <input type='submit' value='Edit'>");
  $("#result").append(item);
};

var onSuccessfulStock = function(data, status) {
  if (data.inStock === true) {
    $('#'+data._id +' span.stockstate').html('false');
    $('#'+data._id +' span.stockbutton').html('Add');
  } else {
    $('#'+data._id +' span.stockstate').html('true');
    $('#'+data._id +' span.stockbutton').html('Out-of-Stock');
  }
};

var onSuccessfulEdit = function(data, status) {
  console.log(data.name,data.price,data._id);
  $('#'+data._id +' span.name').html(data.name);
  $('#'+data._id +' span.price').html(data.price);
};

var onError = function(data, status) {
  console.log("status", status);
  console.log("error", data);
};

$("#ingredient-list").on('click','.stock',function() {
  var ingredientID = $(this).parent().attr('id');
  $.post("stock", {
    id: ingredientID
  })
    .done(onSuccessfulStock)
    .error(onError);
});

$("#ingredient-list").on('submit','.edit-form',function(event) {
  event.preventDefault();
  var ingredientID = $(this).parent().attr('id');
  var name = $(this).find("[name='name']").val();
  var price = $(this).find("[name='price']").val();
  $.post("edit", {
    id: ingredientID,
    name: name,
    price: price
  })
    .done(onSuccessfulEdit)
    .error(onError);
});

$form.submit(function(event) {
  event.preventDefault();
  var name = $form.find("[name='name']").val();
  var price = $form.find("[name='price']").val();
  var inStock = true;
  $.post("ingredients", {
    name: name,
    price: price,
    inStock: inStock
  })
    .done(onSuccess)
    .error(onError);
});
