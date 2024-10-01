from functools import cache
import pandas as pd
from dummy_server.models.dataset_loader import get_data

SKIP_TRAINING_COLUMNS = ["life_ladder", "y", "year", "country_code", "country_name"]


class CorrelationModel:
    def __init__(self):
        self.df = None
        self.stds = None
        self.corr = None

    def fit(self, df: pd.DataFrame):
        self.df = df.drop(columns=SKIP_TRAINING_COLUMNS, errors="ignore").copy()
        self.stds = self.df.std()
        self.corr = self.df.corr()

    def predict(self, base_column, change):
        standardized_change = change / self.stds[base_column]
        correlations = self.corr[base_column]

        changes = {}
        for column in self.corr.columns:
            changes[column] = (
                correlations[column] * self.stds[column] * standardized_change
            )

        return changes


@cache
def get_correlation_model():
    df = get_data()

    model = CorrelationModel()
    model.fit(df)

    return model


def main():
    model = get_correlation_model()
    print(model.predict("life_expectancy_female", 1))


if __name__ == "__main__":
    main()
