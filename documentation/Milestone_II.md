# Milestone II

## Tasks

- Frontend Sketches
  - Explore Page
  - Prediction Page
- Backend Implementation
  - API
  - Main Model
  - Correlation Model
  - Data

## Frontend Sketches

Keep in mind following points (Official Milestone Grading):

- Are the use cases realistic?
- Are the use cases clear and understandable?
- Use of color: are colors used in a way that is helpful to the storyline, are they harmonious, and do they assist readability (e.g. no dark text on a dark background)?
- Does the design follow the perception design principles discussed in the lecture?

The sketches can be either made by hand or using a tool like Figma or AdobeXD. We will make our sketch using Figma because we will need it for Milestone III anyways (Static Dashboard)

## Backend Implementation

Keep in mind following points (Official Milestone Grading):

- Is there at least one endpoint working?
- Does the backend comply with the RESTful style?
- Are the resources structured correctly?
- Is there a reasoning behind the data structure of the endpoint? Does it make sense taking into account the presented sketches?

Let us set the maximum policy count to 12. Then we can naively test all possible combinations of policies in 2^12 = 4096 tries, and they can be arranged nicely on the page in grids of 1/2/3/4 columns.
We will need to tackle the two models of our backend Implementation:

Each Policy Combination will go through the correlation model once, whose output is fed into the main model once. Then we keep track of the optimal policy combination.

### API

We need to set up the two following endpoints.

#### Endpoints:

#### /prediction/optimal

Input:

- All Policies (Sent from Frontend as JSON and converted to Policy Objects in Python)

Outputs:

- Optimal Policy Combination
- Happiness Score Prediction for next PMax years where PMax is the maximum duration of any of the policies

#### /prediction/custom

Input:

- Custom Set of Policies (Sent from Frontend as JSON and converted to Policy Objects in Python)

Outputs:

- Happiness Score Prediction for next PMax years where PMax is the maximum duration of any of the policies


#### /data/indicators
Purpose: query all indicators (columns of the dataset)
Input: empty

Outputs:

```json
[
		{
				"name_short": "Babies per woman", // for dropdown menu display
				"name_catalog": "Babies per women (total fertility)",  // full name for frontend display
				"code": "children_per_woman_total_fertility", // backend code
				"description": "Total fertility rate. The number of children that would be born to each woman with prevailing age-specific fertility rates."
		}
]
```

#### /data/measurements
Purpose: statistics for dashboard (map and parrallel coordinates)

Inputs:

- year_start: int, e.g. 2012, nullable
- year_end: int, e.g. 2020, nullable
- happiness_score_min: float, e.g. 7.2, nullable
- happiness_score_max: float, e.g. 10.0, nullable
- indicators: list of string, e.g. ["happiness_score", "children_per_woman_total_fertility"] // list of indicators of interests

Outputs:

```json
[
  {
    "Country": "Afghanistan",
    "year": 2008,
    "happiness_score": 3.724,
    "children_per_woman_total_fertility": 3.8
  }
]
```


### Main Model (Gaussian Processes)

Input Example (this is the output of our correlation model for one specific policy combination):

| Year | Feature 1 | Feature 2 | Feature 3 |
| ---- | --------- | --------- | --------- |
| 2025 | 12.1      | 12.2      | 12.3      |
| 2026 | 0.04      | 0.05      | 0.06      |
| 2027 | 3.0       | 4.0       | 5.0       |

Input: Output from Correlation Model

Output Example (Happiness score for next years):

#### Output

| Year | Happiness Score | Standard Deviation |
| ---- | --------------- | ------------------ |
| 2025 | 8.2             | 0.1                |
| 2026 | 8.3             | 0.11               |
| 2027 | 8.4             | 0.12               |

Output: Predicted Happiness Score for each year in the near future

#### Model Training

Train the Model on the fully cleaned Dataset (See Below)

### Correlation Model (Linear Regression)

I would suggest we simply do a linear regression using the independent variables (these are the ones we have in our input set of policies) to predict how all other variables change.

Input Example:
[Policy 1, Policy 3, Policy 10, Policy 11] (list of Policy Objects)

Input: Policy Combination (List of objects of Policy Class)

Output Example:

| Year | Feature 1 | Feature 2 | Feature 3 |
| ---- | --------- | --------- | --------- |
| 2025 | 12.1      | 12.2      | 12.3      |
| 2026 | 0.04      | 0.05      | 0.06      |
| 2027 | 3.0       | 4.0       | 5.0       |

Output: all of our features for each subsequent year for the next P_Max years, where P_Max is the maximum duration of any of the policies within the input list

### Data

We want to merge the GapMinder Dataset (For the Features) with the World Health Organization Index Dataset (Happiness Score)

We will need a fully cleaned and prepared dataset as a CSV file in the following format:

| Year | Country     | Feature 1 | Feature 2 | Feature 3 | Feature 4 | Happiness Score |
| ---- | ----------- | --------- | --------- | --------- | --------- | --------------- |
| 2020 | Switzerland | 7.5       | 8.2       | 6.8       | 7.9       | 7.1             |
| 2020 | France      | 7.0       | 7.5       | 6.5       | 7.0       | 6.7             |
| 2021 | Switzerland | 7.6       | 8.3       | 7.0       | 8.0       | 7.2             |
| 2021 | France      | 7.1       | 7.6       | 6.6       | 7.1       | 6.8             |
| 2022 | Switzerland | 7.7       | 8.4       | 7.2       | 8.1       | 7.3             |
| 2022 | France      | 7.2       | 7.7       | 6.7       | 7.2       | 6.9             |
| 2023 | Switzerland | 7.8       | 8.5       | 7.4       | 8.2       | 7.4             |
| 2023 | France      | 7.3       | 7.8       | 6.8       | 7.3       | 7.0             |
| 2024 | Switzerland | 7.9       | 8.6       | 7.6       | 8.3       | 7.5             |
| 2024 | France      | 7.4       | 7.9       | 6.9       | 7.4       | 7.1             |

For the initial version, 10 features for as many countries and years as possible. The whole range of years needs to be included for all countries (as early as possible until 2023/2024). In above Table, Feature 1 until Feature 4 come from the GapMinder Dataset. The Happiness Score comes from the World Happiness Report

### Policy Class

This is the specification for the policy class

```python
class Policy:
  def __init__(self, feature_name, feature_change, cost, duration, confidence):
    self.feature_name = feature_name
    self.feature_change = feature_change
    self.cost = cost
    self.duration = duration
    self.confidence = confidence
```
