module Predicates
  module Common
    include Dry::Logic::Predicates

    predicate(:exist?) do |repository, value|
      repository.exists?(id: value)
    end
  end
end
