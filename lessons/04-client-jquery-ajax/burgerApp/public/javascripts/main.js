var $form = $("#ajax-form");
var $edit = $(".edit-form");

var onSuccess = function(data, status) {
  var item = ("<li><div id=" + data._id + "><span class='name'>" + data.name + "</span> - price: $<span class='price'>" + data.price + "</span>, in stock: <span class='stockstate'>" + data.inStock + "</span>\
  <button class='stock' type='button'><span class='stockbutton'>Out-of-Stock</span></button>\
  <button class='edit' type='button'>Edit</button></div></li>");
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

$edit.submit(function(event) {
  event.preventDefault();
  var ingredientID = $(this).parent().attr('id');
  var name = $form.find("[name='name']").val();
  var price = $form.find("[name='price']").val();
  console.log(name, price);
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
