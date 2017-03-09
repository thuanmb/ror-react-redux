require 'dry-validation'
require 'dry-types'

class BaseSchema
  class DryValidationError < StandardError; end
  def self.build_output(schema, params)
    result = schema.(params)
    if result.success?
      result.output
    else
      raise DryValidationError, format_message(result)
    end
  end

  def self.format_message(result)
    result.messages(full: true).values.join(', ').capitalize
  end
end
