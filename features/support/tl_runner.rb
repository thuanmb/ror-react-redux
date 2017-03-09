class Cucumber::Core::Test::Runner
  def reset_test_case
    @running_test_case = RunningTestCase.new
  end
end


# Reset the test case status if it is called with the flag already_run
#
# def describe_to(visitor, *args)
#   visitor.test_case(self, *args) do |child_visitor|
#     compose_around_hooks(child_visitor, *args) do
#       test_steps.each do |test_step|
#         test_step.describe_to(child_visitor, *args)
#       end
#     end
#   end
#   self
# end

class Cucumber::Core::Test::Case
  def describe_to(visitor, *args)
    visitor.test_case(self, *args) do |child_visitor|
      compose_around_hooks(child_visitor, *args) do |already_run|
        child_visitor.reset_test_case if already_run
        test_steps.each do |test_step|
          test_step.describe_to(child_visitor, *args) if test_step
        end
      end
    end
    self
  end
end

module Cucumber
  module Formatter
    module LegacyApi
      class LegacyResultBuilder
        attr_reader :status
        def initialize(result)
          @result = result
          @result.describe_to(self) if @result
        end
      end
    end
  end
end

#
# This patch does not check the test steps failed. It only detects the test cases failed
#
# def failure?
#   if @configuration.wip?
#     summary_report.test_cases.total_passed > 0
#   else
#     summary_report.test_cases.total_failed > 0 || summary_report.test_steps.total_failed > 0 ||
#       (@configuration.strict? && (summary_report.test_steps.total_undefined > 0 || summary_report.test_steps.total_pending > 0))
#     end
#   end
# end
#
module Cucumber
  class Runtime
    def failure?
      if @configuration.wip?
        summary_report.test_cases.total_passed > 0
      else
        summary_report.test_cases.total_failed > 0  ||
          (@configuration.strict? && (summary_report.test_steps.total_undefined > 0 || summary_report.test_steps.total_pending > 0))
      end
    end
  end
end
