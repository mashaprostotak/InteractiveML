import sys
import os
import pickle
import argparse
import pandas as pd
import numpy as np
from sklearn.impute import KNNImputer
from sklearn.model_selection import train_test_split
from sklearn.gaussian_process import GaussianProcessRegressor
from sklearn.gaussian_process.kernels import DotProduct, WhiteKernel, ConstantKernel
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import StandardScaler
from dummy_server.models.dataset_loader import get_data, FEATURES_TO_KEEP, get_data_path

TARGET_VARIABLES = ["life_ladder", "y"]


def drop_missing_columns(df):
    missing_cols = set(df.columns[df.isnull().mean() > 0.5])

    return df.drop(columns=missing_cols), missing_cols


def scale_data(df, scaler=None):
    unscaled = ["life_ladder", "y", "year", "country_name", "country_code"]

    if scaler is None:
        scaler = StandardScaler()
        scaler.fit(df.drop(unscaled, axis=1))

    scaled = scaler.transform(df.drop(unscaled, axis=1, errors="ignore"))
    scaled_df = pd.DataFrame(scaled, columns=df.drop(unscaled, axis=1).columns)

    for col in unscaled:
        scaled_df[col] = df[col].values

    return scaled_df, scaler


def unscale_data(df, scaler):
    unscaled = ["life_ladder", "y", "year", "country_name", "country_code"]

    scaled = scaler.inverse_transform(df.drop(unscaled, axis=1, errors="ignore"))
    scaled_df = pd.DataFrame(scaled, columns=df.drop(unscaled, axis=1).columns)

    for col in unscaled:
        scaled_df[col] = df[col].values

    return scaled_df


def impute_missing(df, imputer=None):
    """Imputes the missing data"""
    df = df.copy()

    # numeric only
    df_numeric = df.select_dtypes(include=[np.number])

    if imputer is None:
        imputer = KNNImputer(n_neighbors=5)
        imputer.fit(df_numeric)

    df[df_numeric.columns] = imputer.transform(df_numeric)

    return df, imputer


def split_train_test(df, test_size=0.2):
    """Split between train and test by country"""
    countries = df["country_code"].unique()
    train_countries, val_countries = train_test_split(
        countries, test_size=test_size, random_state=1065
    )
    train_df = df[df["country_code"].isin(train_countries)].copy()
    val_df = df[df["country_code"].isin(val_countries)].copy()

    return train_df, val_df


def find_duplicates(df, threshold=0.95):
    """Finds columns that are basically duplicates"""
    corr_matrix = df.corr().abs()

    upper = corr_matrix.where(np.triu(np.ones(corr_matrix.shape), k=1).astype(bool))

    to_drop = set(
        column for column in upper.columns if any(upper[column] > threshold)
    ) - set(TARGET_VARIABLES)

    return to_drop


def select_features(df, k=10):  # pylint: disable=unused-argument
    """Selects the k best features for the target variable"""
    return list(
        set(FEATURES_TO_KEEP).difference(
            [
                "country_name",
                "country_code",
                "year",
            ]
        )
    )
    # X = df.drop(columns=TARGET_VARIABLES)
    # y = df["y"]

    # selector = SelectKBest(f_regression, k=k)
    # selector.fit(X, y)
    # selected_cols = X.columns[selector.get_support()]

    # return list(selected_cols) + TARGET_VARIABLES


def train_model(df):
    """Train a Gaussian process regression model"""
    x_columns = df.columns.difference(TARGET_VARIABLES)
    kernel = ConstantKernel() * DotProduct() + WhiteKernel()
    model = GaussianProcessRegressor(
        kernel=kernel,
        random_state=1065,
    )
    model.fit(df[x_columns], df["y"])

    return model


def compute_score(model, df):
    """Computes the mean squared error of the model"""
    x_columns = df.columns.difference(TARGET_VARIABLES)
    y_pred = model.predict(df[x_columns])

    return mean_squared_error(df["y"], y_pred)


def pickle_model(model, output_filename):
    """Pickles the model into the models directory"""
    models_path = os.path.join(get_data_path(), "models/")
    output_path = os.path.join(models_path, output_filename)

    with open(output_path, "wb") as fout:
        pickle.dump(model, fout)

    return output_path


def load_model(output_filename):
    """Loads the pickled model from the models directory"""
    models_path = os.path.join(get_data_path(), "models/")
    output_path = os.path.join(models_path, output_filename)

    with open(output_path, "rb") as fin:
        model = pickle.load(fin)

    return model


def parse_args(argv):
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--full_train", action="store_true", help="Use all available data for training"
    )
    parser.add_argument("--output_filename", default="gpr.pkl")

    return parser.parse_args(argv)


def main(argv):
    args = parse_args(argv)

    print("📦 Reading data")

    df = get_data()

    print("🧹 Cleaning data")

    df, missing_cols = drop_missing_columns(df)

    df, scaler = scale_data(df)

    df, imputer = impute_missing(df)

    if args.full_train:
        train_df, val_df = df.copy(), df.copy()
    else:
        train_df, val_df = split_train_test(df)

    to_drop = ["country_code", "country_name", "year"]
    train_df.drop(to_drop, axis=1, inplace=True)
    val_df.drop(to_drop, axis=1, inplace=True)

    print("🔍 Selecting features")

    # NOTE: columns are already selected
    # to_drop = find_duplicates(train_df)
    # train_df.drop(to_drop, axis=1, inplace=True)
    # val_df.drop(to_drop, axis=1, inplace=True)

    selected_cols = select_features(train_df, k=20)
    train_df = train_df[selected_cols]
    val_df = val_df[selected_cols]

    print("🚂 Training model")

    model = train_model(train_df)

    train_score = compute_score(model, train_df)
    val_score = compute_score(model, val_df)

    print(f"🔢 {train_score=}, {val_score=}")

    print("🥒 Pickling model")

    output_path = pickle_model(
        {
            "gpr": model,
            "scaler": scaler,
            "imputer": imputer,
            "selected_cols": selected_cols,
            "missing_cols": missing_cols,
        },
        args.output_filename,
    )

    print(f"📤 Model saved to {output_path}")

    print("🎉 Done!")


if __name__ == "__main__":
    main(sys.argv[1:])
