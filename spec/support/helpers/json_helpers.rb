module Requests
  module JsonHelpers
    def parse_json
      JSON.parse(response.body).with_indifferent_access.symbolize_keys
    end
  end
end
