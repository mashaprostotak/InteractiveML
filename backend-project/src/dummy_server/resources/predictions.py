import os
import random
import pandas as pd
from flask_restful import Resource
from flask import request
from dummy_server.services.api import api_success, api_fail
from dummy_server.models.happiness_prediction_model import (
    predict_happiness,
    get_current_data,
)
from dummy_server.models.policy import Policy
import itertools


# Function to generate all combinations as lists except the empty one
def generate_combinations(policies):
    all_combinations = []
    for r in range(1, len(policies) + 1):
        combinations = itertools.combinations(policies, r)
        all_combinations.extend([list(combo) for combo in combinations])
    return all_combinations


def find_optimal_policies(policies, country_code, year, budget):
    max_happiness = 0.0
    optimal_combination = []
    for policy_combination in generate_combinations(policies):

        policy_objects = [
            Policy(
                x["name"],
                x["cost"],
                x["indicator"],
                x["change"],
                x["years"],
                x["uncertainty"],
            )
            for x in policy_combination
        ]

        if sum(x.cost for x in policy_objects) > budget:
            continue

        df = predict_happiness(country_code, policy_objects, year)
        happiness_last_year = float(df["life_ladder"].iloc[-1])

        if happiness_last_year > max_happiness:
            max_happiness = happiness_last_year
            optimal_combination = policy_combination

    return optimal_combination


def make_predictions(country_code, policies, year):
    policies = [
        Policy(
            x["name"],
            x["cost"],
            x["indicator"],
            x["change"],
            x["years"],
            x["uncertainty"],
        )
        for x in policies
    ]

    df = predict_happiness(country_code, policies, year)

    current = get_current_data(country_code, year)

    # use same columns as df
    current = current[df.columns]

    # compute changes on the very last year
    last_year = df["year"].max()
    latest_changes = df[df["year"] == last_year]

    # compute changes on the current year
    current_changes = current[current["year"] == year]

    indicator_changes = []
    indicators = set(df.columns)
    indicators.difference_update(
        ["year", "life_ladder", "y", "country_code", "country_name"]
    )

    indicators_data = pd.read_csv(
        os.path.join(os.environ["DATA_PATH"], "happiness-datasets/concepts_full.csv")
    )

    indicators_map = {
        row["concept"]: row for row in indicators_data.to_dict(orient="records")
    }

    for indicator in indicators:
        indicator_changes.append(
            {
                "indicator": indicator,
                "indicator_name_short": indicators_map[indicator]["name_short"],
                "change": (
                    latest_changes[indicator].values[0]
                    - current_changes[indicator].values[0]
                )
                or 0,
            }
        )

    predictions = []

    for i, row in enumerate(df.to_dict(orient="records")):
        predictions.append(
            {
                "year": row["year"],
                "mean": row["life_ladder"],
                "standard_deviation": (i) * 0.1,  # multiplying the index by 0.1
            }
        )

    return predictions, indicator_changes


class OptimalPredictionsResource(Resource):

    def post(self):
        data = request.json
        # TODO validation
        budget = data["budget"]
        policies = data["policies"]
        country_code = data["country"]

        try:
            current = get_current_data(country_code, 2022)
        except ValueError as e:
            return api_fail(e.args[0])

        chosen_policies = find_optimal_policies(policies, country_code, 2022, budget)

        used_budget = sum([x["cost"] for x in chosen_policies])

        chosen_policies.sort(key=lambda x: x["name"])
        predictions, indicator_changes = make_predictions(
            country_code, chosen_policies, 2022
        )

        return api_success(
            {
                "policies": chosen_policies,
                "indicator_changes": indicator_changes,
                "used_budget": used_budget,
                "predictions": predictions,
            }
        )


class CustomPredictionsResource(Resource):

    def post(self):
        data = request.json
        # TODO validation
        budget = data["budget"]
        policies = data["policies"]
        country_code = data["country"]
        # years = data["years"]

        try:
            current = get_current_data(country_code, 2022)
        except ValueError as e:
            return api_fail(e.args[0])

        # dummy implementation
        chosen_policies = []
        used_budget = 0
        for policy in policies:
            if used_budget + policy["cost"] > budget:
                continue
            if policy["userSelection"] == True:
                chosen_policies.append(policy)
                used_budget += policy["cost"]

        used_budget = sum(x["cost"] for x in policies)
        predictions, indicator_changes = make_predictions(
            country_code, chosen_policies, 2022
        )

        return api_success(
            {
                "policies": chosen_policies,
                "indicator_changes": indicator_changes,
                "used_budget": used_budget,
                "predictions": predictions,
            }
        )
