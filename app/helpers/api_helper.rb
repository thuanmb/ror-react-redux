module ApiHelper
  STATUS_CODES = {OK: 200, FAILED: 400, UNAUTHORIZED: 401, FORBIDDEN: 403, NOT_FOUND: 404, ERROR: 500 }

  def web_api_respond(*args)
    status = args[0] || 'OK'
    response_hash = args[1] || {}
    response = { status: status }.merge(response_hash)
    render json: response, status: STATUS_CODES[status]
  end

  STATUS_CODES.keys.each do |status|
    define_method(:"api_respond_#{status.downcase}") do |*args|
      response_hash = args[0] || {}
      web_api_respond(status, response_hash)
    end
  end
end
