class SubscriptionsController < ApplicationController
  before_action :authenticate_user!, except: [:new]
  before_action :redirect_to_signup, only: [:new]
  def show
  end

  def new
  end

  def create
    if current_user.strip_id?
      customer = Stripe::Customer.retrieve(current_user.stripe_id)
    else
      customer = Stripe::Custumer.create(email: current_user.email)
    end

    subscription = customer.subscriptions.create(
      source: parmas[:stripeToken],
      plan: "monthy"
    )

    current_user.update(
      stripe_id: customer.id,
      stripe_subscription_id: subscription.id
    )

    redirect_to root_path
  end

  def destroy
  end

  private

  def redirect_to_signup
    if !user_signed_in?
      session["user_return_to"] = new_subscription_path
      redirect_to new_user_registration_path
    end
  end
end
