import os
import pandas as pd
from flask_restful import Resource
from flask import request
from dummy_server.services.api import api_success, api_fail
from dummy_server.models.happiness_prediction_model import get_indicator_currently, get_current_data


class DataResource(Resource):

    def __init__(self):
        self.path = os.path.join(
            os.environ["DATA_PATH"], "happiness-datasets-small/data.csv"
        )

    def get(self):
        data = pd.read_csv(self.path)
        year_start = int(request.args.get("year_start", default=2010))
        year_end = int(request.args.get("year_end", default=2022))
        happiness_score_min = float(
            request.args.get("happiness_score_min", default=0.0)
        )
        happiness_score_max = float(
            request.args.get("happiness_score_max", default=10.0)
        )
        indicators = (request.args.get("indicators", default="")).split(",")
        indicators = [indicator for indicator in indicators if indicator]

        columns_slicers = list(indicators)
        columns_slicers.append("year")
        columns_slicers.append("country_name")
        columns_slicers.append("country_code")

        print(columns_slicers)

        data = data[
            (data["year"] >= year_start)
            & (data["year"] <= year_end)
            & (data["life_ladder"] >= happiness_score_min)
            & (data["life_ladder"] <= happiness_score_max)
        ][columns_slicers]

        data.dropna(inplace=True)

        return api_success(data.to_dict(orient="records"))


class IndicatorResource(Resource):

    def __init__(self):
        self.path = os.path.join(
            os.environ["DATA_PATH"], "happiness-datasets-small/concept.csv"
        )

    def get(self):
        concepts = pd.read_csv(self.path)
        concepts = concepts[
            ["name_short", "name_catalog", "description", "concept"]
        ].rename({"concept": "code"})

        return api_success(concepts.to_dict(orient="records"))


class CurrentIndicatorResource(Resource):

    def post(self):
        data = request.json
        current_year = data["current_year"]
        country_code = data["country_code"]
        indicators = data["indicators"]

        current_indicators = []

        try:
            current = get_current_data(country_code, current_year)
        except ValueError as e:
            return api_fail(e.args[0])

        for indicator in indicators:
            current_value = get_indicator_currently(
                country_code, int(current_year), indicator["concept"]
            )
            current_indicators.append(
                {"concept": indicator["concept"], "value": current_value}
            )

        return api_success({"current_indicators": current_indicators})
