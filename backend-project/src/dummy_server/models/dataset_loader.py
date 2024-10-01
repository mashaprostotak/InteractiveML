import os
import pandas as pd
import numpy as np


PROJECT_ROOT = os.path.join(os.path.dirname(os.path.realpath(__file__)), "../../../")


def get_data_path():
    return os.environ.get("DATA_PATH", os.path.join(PROJECT_ROOT, "data"))


FEATURES_TO_KEEP = [
    "country_name",
    "country_code",
    "year",
    #
    "life_ladder",
    "y",
    #
    "cell_phones_per_100_people",
    "children_out_of_school_primary",
    "children_per_woman_total_fertility",
    "co2_emissions_tonnes_per_person",
    "mean_years_in_school_men_25_to_34_years",
    "mean_years_in_school_women_65_plus_years",
    "population_aged_0_14_years_male_percent",
    "at_least_basic_water_source_overall_access_percent",
    "broadband_subscribers_per_100_people",
    "agriculture_workers_percent_of_employment",
    "gnipercapita_constant_2015_us",
    "female_self_employed_percent_of_female_employment",
    "breast_cancer_new_cases_per_100000_women",
    "internet_users",
    "newborn_mortality_rate_per_1000",
    "salaried_workers_percent_of_non_agricultural_employment",
    "income_per_person_long_series",
    "food_supply_kilocalories_per_person_and_day",
    "hdi_human_development_index",
    "urban_population_percent_of_total",
    "service_workers_percent_of_employment",
    "life_expectancy_male",
    "at_least_basic_sanitation_rural_access_percent",
    "fixed_line_subscribers_per_100_people",
]


def life_ladder_to_y(x):
    """Map the (0, 10) value to a (-\\infty, +\\infty) value"""
    return np.tan(x * np.pi / 10 - np.pi / 2)


def y_to_life_ladder(y):
    return (np.arctan(y) + np.pi / 2) * 10 / np.pi


def get_data():
    """Loads the data, removes irrelevant columns"""

    df = pd.read_csv(
        os.path.join(
            get_data_path(),
            "happiness-datasets/merged_data_full.csv",
        )
    )

    dropped = set()
    dropped.update(
        set(
            [
                # life-ladder explaining columns
                "log_gdp_per_capita",
                "social_support",
                "healthy_life_expectancy_at_birth",
                "freedom_to_make_life_choices",
                "generosity",
                "perceptions_of_corruption",
                "corruption_perception_index_cpi",
                "corruption_perception_index_cpi_pre2012",
            ]
        )
    )

    df = df.drop(columns=dropped)

    df["y"] = life_ladder_to_y(df["life_ladder"])

    return df
