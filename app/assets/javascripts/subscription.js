var stripeResponseHandler;

jQuery(function() {
  Stripe.setPublishableKey($("meta[name='stripe-key']").attr("content"));
  $('#payment-form').submit(function(event) {
    var $form = $(this);
    if ($(".card-fields").hasClass("hidden")) {
      $form.get(0).submit();
    } else {
      $form.find('button').prop('disabled', true);
      Stripe.card.createToken($form, stripeResponseHandler);
    }
    return false;
  });
  return $('.use-different-card').on("click", function() {
    $(".card-on-file").hide();
    return $(".card-fields").removeClass("hidden");
  });
});

stripeResponseHandler = function(status, response) {
  var $form, token;
  $form = $('#payment-form');
  if (response.error) {
    $form.find('.payment-errors').text(response.error.message);
    $form.find('button').prop('disabled', false);
  } else {
    token = response.id;
    $form.append($('<input type="hidden" name="stripeToken" />').val(token));
    $form.append($('<input type="hidden" name="card_last4" />').val(response.card.last4));
    $form.append($('<input type="hidden" name="card_exp_month" />').val(response.card.exp_month));
    $form.append($('<input type="hidden" name="card_exp_year" />').val(response.card.exp_year));
    $form.append($('<input type="hidden" name="card_brand" />').val(response.card.brand));
    $form.get(0).submit();
  }
};

// ---
// generated by coffee-script 1.9.2