class Api::V1::BaseController < ApplicationController
  include ApiHelper
  include Pundit
  after_action :verify_authorized

  before_filter :authenticate!
  rescue_from StandardError, with: :render_error_all
  rescue_from BaseSchema::DryValidationError, with: :render_error_400
  rescue_from ActiveRecord::RecordNotFound, with: :render_error_404
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  respond_to :json

  def pundit_user
    current_session
  end

  def authenticate!
    warden.authenticate!
  end

  def current_user
    current_session.user
  end

  def current_organization
    current_session.organization
  end

  def current_permission
    current_session.permission
  end

  private

  def render_error_404(error)
    api_respond_not_found(message: error.message)
  end

  def render_error_all(error)
    api_respond_error(message: I18n.t('errors.something_wrong'))
  end

  def render_error_400(error)
    api_respond_failed(message: error.message)
  end

  def render_error_401(error)
    api_respond_unauthorized(message: error.message)
  end

  def render_error_403(error)
    api_respond_forbidden(message: error.message)
  end

  def user_not_authorized(error)
    api_respond_forbidden(message: I18n.t('errors.user_not_authorized'))
  end

  def current_session
    warden.user
  end

  def warden
    request.env['warden']
  end
end
