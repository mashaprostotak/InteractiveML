from flask_restful import Api
import dummy_server.resources as res

API = "/api/v1/"  # optional string


def add_routes(app):
    api = Api(app)

    # api.add_resource(res.scatter_data.DatasetResource, API + "data/<string:name>")
    api.add_resource(res.happiness_data.DataResource, API + "data/measurements")
    api.add_resource(res.happiness_data.IndicatorResource, API + "data/indicators")
    api.add_resource(
        res.happiness_data.CurrentIndicatorResource, API + "data/indicators/current"
    )

    api.add_resource(res.scatter_data.DatasetResource, API + "data/<string:name>")

    api.add_resource(
        res.predictions.OptimalPredictionsResource, API + "predictions/optimal"
    )
    api.add_resource(
        res.predictions.CustomPredictionsResource, API + "predictions/custom"
    )

    return api
