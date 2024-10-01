from functools import cache
import pandas as pd
from dummy_server.models.policy import Policy
from dummy_server.models.dataset_loader import (
    get_data,
    y_to_life_ladder,
)
from dummy_server.models.gaussian_process import (
    load_model,
    scale_data,
    unscale_data,
    impute_missing,
    TARGET_VARIABLES,
)
from dummy_server.models.correlation_model import get_correlation_model


@cache
def _load_model(output_filename):
    return load_model(output_filename)


@cache
def _get_data():
    return get_data()


def get_current_data(country_code, year):
    df = _get_data()
    df = df[df["country_code"] == country_code]
    df = df[df["year"] == year]

    if len(df) == 0:
        raise ValueError(f"No data for country_code {country_code} and year {year}")

    full_model = _load_model("gpr.pkl")

    scaler = full_model["scaler"]
    imputer = full_model["imputer"]
    missing_cols = full_model["missing_cols"]

    df = df.drop(missing_cols, axis=1, inplace=False)
    df, _ = scale_data(df, scaler=scaler)
    df, _ = impute_missing(df, imputer=imputer)
    df = unscale_data(df, scaler)

    return df


def get_indicator_currently(country_code, year, indicator):
    df = get_current_data(country_code, year)

    # Check if the indicator is a valid column
    if indicator not in df.columns:
        raise ValueError(f"Indicator '{indicator}' is not a valid column.")

    # Filter the DataFrame
    filtered_df = df.loc[(df["country_code"] == country_code) & (df["year"] == year)]

    # Check if exactly one row matches the filter criteria
    if filtered_df.shape[0] != 1:
        raise ValueError("The filter criteria do not return exactly one row.")

    # Retrieve the value for the specified indicator
    value = filtered_df[indicator].iloc[0]

    # Return the value rounded to two decimal places
    return round(value, 2)


def predict_happiness(country_code, policies, year):
    full_model = _load_model("gpr.pkl")

    gpr = full_model["gpr"]
    scaler = full_model["scaler"]
    selected_cols = full_model["selected_cols"]

    df = _get_data()

    # get bounds for variables
    bounds = df[selected_cols].agg(["min", "max"]).T
    df = get_current_data(country_code, year)

    # make 5 copies of the row, one for each passing year
    data_by_year = [df.iloc[0]]
    for next_year in range(year + 1, year + 6):
        next_year_df = df.iloc[0].copy()
        next_year_df["year"] = next_year
        data_by_year.append(next_year_df)

    correlation_model = get_correlation_model()
    for policy in policies:
        predictions = correlation_model.predict(policy.indicator, policy.change)
        for column, change in predictions.items():
            if column not in data_by_year[0]:
                continue

            for i in range(1, 6):
                fraction = min(1, i / policy.years)
                data_by_year[i][column] += change * fraction

    for column in selected_cols:
        # make the values respect the bounds
        for i in range(1, 6):
            data_by_year[i][column] = min(
                max(data_by_year[i][column], bounds.loc[column, "min"]),
                bounds.loc[column, "max"],
            )

    initial_year_ladder = data_by_year[0]["life_ladder"]
    df = pd.DataFrame(data_by_year, index=range(year, year + 6))
    year_column = df["year"]

    gpr_df, _ = scale_data(df, scaler=scaler)
    gpr_df = gpr_df[selected_cols]

    x_columns = gpr_df.columns.difference(TARGET_VARIABLES)

    df["y"] = gpr.predict(gpr_df[x_columns])
    df["life_ladder"] = y_to_life_ladder(df["y"])
    residual = df["life_ladder"].values[0] - initial_year_ladder

    df["life_ladder"] = df["life_ladder"] - residual
    df["year"] = year_column

    # only keep selected_cols
    final_columns = selected_cols + ["year"]
    final_columns.remove("y")
    df = df[final_columns]

    return df


def find_optimal_combination(policies):
    """Finds an optimal combination of policies"""


def main():
    policies = [
        Policy(
            "Policy A",
            100,
            "cell_phones_per_100_people",
            2,
            5,
            100,
        ),
        Policy(
            "Policy B",
            100,
            "income_per_person_long_series",
            2000,
            5,
            100,
        ),
    ]

    df = predict_happiness("CHE", policies, 2022)
    print(df)

    get_indicator_currently("CHE", 2022, indicator)


if __name__ == "__main__":
    main()
