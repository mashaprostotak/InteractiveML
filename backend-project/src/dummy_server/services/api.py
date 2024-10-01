from flask import jsonify


def api_fail(message, code=400):
    """Use this function to signal that there was an error on the client side,
    for example, if the user sends a request with invalid data."""
    response = jsonify({"status": "fail", "message": message})
    response.status_code = code

    return response


def api_error(message, code=500):
    """Use this function to signal that there was an error on the server side."""
    response = jsonify({"status": "error", "message": message})
    response.status_code = code

    return response


def api_success(data, code=200):
    """Return a response with a successful status."""
    response = jsonify({"status": "success", "data": data})
    response.status_code = code

    return response
