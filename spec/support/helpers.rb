require 'support/helpers/session_helpers'
require 'support/helpers/json_helpers'
RSpec.configure do |config|
  config.include Features::SessionHelpers, type: :feature
  config.include Requests::JsonHelpers, type: :request
end
