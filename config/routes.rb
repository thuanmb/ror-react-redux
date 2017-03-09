Rails.application.routes.draw do
  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'
  require 'sidekiq/web'
  apipie
  root to: 'my_project#index'

  mount Sidekiq::Web => '/sidekiq'

  match '*a', to: 'my_project#index', via: :all
end
