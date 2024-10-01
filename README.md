# Predicting happiness levels for policies

## Team Members

1. Mariia Eremeeva
2. Alessandro Girardi
3. Julien Wolfensberger
4. Hongshu Yan

## Project Description

- A Policymaker is given a budget X and a set of Policies {P1, P2, …, PN} to choose from
- Each of these Policies has an associated cost and aims to change one metric directly
- Example: Policy 1 costs $200k and aims to decrease the unemployment rate by 5% over the next 5 years
- This project is a tool that answers the question: Which Policies should the Policymaker choose in order to increase the happiness of the people in his or her country the most?

### Users

Policymakers, citizens

### Datasets

We make use of the following datasets:

1. https://www.gapminder.org/data/
2. https://www.kaggle.com/datasets/unsdsn/world-happiness
3. ...
   Document here where to find the data and how to download it.

### Tasks

- Compute how policies impact the happiness score
- Find the optimal combination of policies w.r.t. happiness score
- Compute the overall happiness score change for a user policy selection
- Display how metrics are affected based on policy selection

---

## Folder Structure

Specify here the structure of you code and comment what the most important files contain

```
.
├── backend-project
│   ├── bruno/  # Documentation for the endpoints
│   ├── data
│   │   ├── happiness-datasets/  # Full datasets
│   │   ├── happiness-datasets-small/  # Partial datasets
│   │   └── models/  # Cached models
│   ├── Dockerfile
│   ├── MANIFEST.in
│   ├── pyproject.toml
│   ├── README.md
│   ├── setup.py
│   └── src
│       └── dummy_server
│           ├── models/  # Model logic
│           ├── resources/  # Api resources
│           ├── router
│           │   ├── app.py  # App entrypoint
│           │   └── routes.py
│           └── services
│               └── api.py  # Utilities for api
├── docker-compose.dev.yml  # Override for development
├── docker-compose.prod.yml  # Override for deployment
├── docker-compose.yml
├── documentation/
├── helm/
├── iml-project.code-workspace  # Workspace for vscode
├── react-frontend
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.cjs
│   ├── public/
│   ├── README.md
│   ├── src
│   │   ├── App.tsx
│   │   ├── components/  # React components for the project
│   │   ├── data/
│   │   ├── hooks/  # Utility react hooks
│   │   ├── index.css
│   │   ├── index.tsx  # App entrypoint
│   │   ├── nivo-geo/  # Patched nivo-geo
│   │   ├── reportWebVitals.ts
│   │   ├── services
│   │   │   ├── apiClient.ts
│   │   │   ├── api.tsx  # Utility functions, handles api calls
│   │   │   └── resources/  # Backend resources
│   │   └── types/  # Types organized in single directory
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vite.config.js
│   └── vite-env.d.ts
└── README.md
```

## Requirements

You will need [docker](https://docs.docker.com/) and the [compose plugin](https://docs.docker.com/compose/) to run this project.

## How to Run

- clone the repository;
- open a terminal instance and using the command `cd` move to the folder where the project has been downloaded;
- specify the docker override configuration by running `ln -s docker-compose.dev.yml docker-compose.override.yml` (for development mode);
- Start using `docker compose up`.

### Development considerations

For development purposes it is _strongly_ recommended to set up the python environment and node modules, you can read the instructions for these steps under the specific directories.

## Milestones

Document here the major milestones of your code and future planned steps.\

- [x] Milestone 1

  - [x] [Milestone 1 Video](https://www.loom.com/share/684c45443721453cb19394db09fee566)

- [x] Milestone 2

  - [x] Frontend Sketches
    - [x] Explore Page [Figma #1](https://www.figma.com/file/Gokss4YCwj9jTnH4qVA9Dr/XAIML-Mockup?type=design&node-id=0%3A1&mode=design&t=yPIPr3hh8jqNON9o-1)
    - [x] Prediction Page [Figma #2](https://www.figma.com/file/Gokss4YCwj9jTnH4qVA9Dr/XAIML-Mockup?type=design&node-id=0%3A1&mode=design&t=yPIPr3hh8jqNON9o-1)
  - [x] Backend Implementation
    - [x] API [#1](https://gitlab.inf.ethz.ch/course-xai-iml24/c3-happiness-prediction/-/issues/1)
    - [x] Data Preparation/Cleaning/Merging [#2](https://gitlab.inf.ethz.ch/course-xai-iml24/c3-happiness-prediction/-/issues/4)

- [x] Milestone 3
  - [x] Implement Static Explore Page
    - [x] Chloropleth Map [#1](https://gitlab.inf.ethz.ch/course-xai-iml24/c3-happiness-prediction/-/commit/e0a7980b2802f5f9a96cc8b173af56be7776cef4)
    - [x] Parallel Lines Clustering Graph [#2](https://gitlab.inf.ethz.ch/course-xai-iml24/c3-happiness-prediction/-/commit/8b3f08c10d342e6d5e9d95cdf7d2a392c3efe58f)
  - [x] Implement Static Prediction Page
    - [x] Input Part [#3](https://gitlab.inf.ethz.ch/course-xai-iml24/c3-happiness-prediction/-/commit/fa8683dc7e64ab368cf3773c22e3c6248c6dd018)
    - [x] Happiness Prediction Graph [#4](https://gitlab.inf.ethz.ch/course-xai-iml24/c3-happiness-prediction/-/commit/5956d16598db710b22686ce661aa5d7ff69d7132)
    - [x] Policy Combination Donut Chart [#5](https://gitlab.inf.ethz.ch/course-xai-iml24/c3-happiness-prediction/-/commit/49eef942aec36312187284b8b1b1abf91c52e163)
    - [x] Metric Change Bar Chart [#6](https://gitlab.inf.ethz.ch/course-xai-iml24/c3-happiness-prediction/-/commit/a953d031889701282608a56bf48daaa1ac437e2f)

Create a list subtask.\
Open an issue for each subtask. Once you create a subtask, link the corresponding issue.\
Create a merge request (with corresponding branch) from each issue.\
Finally accept the merge request once issue is resolved. Once you complete a task, link the corresponding merge commit.\
Take a look at [Issues and Branches](https://www.youtube.com/watch?v=DSuSBuVYpys) for more details.

This will help you have a clearer overview of what you are currently doing, track your progress and organise your work among yourselves. Moreover it gives us more insights on your progress.

## Weekly Summary

Write here a short summary with weekly progress, including challanges and open questions.\
We will use this to understand what your struggles and where did the weekly effort go to.

Summary Milestone 1:

- We defined exactly what our tool is supposed to do and what outputs it should give us. The biggest challenge was making sure all parts of our tool fit together

Summary Milestone 2:

- We made a sketch of the frontend using figma. We made sure to use design principles used in the lecture such as Gestalt Principles, Good Color Schemes with enough contrast, chloropleth maps, bar charts etc.
- We used a tool called Bruno to make the API endpoints documentable and testable. Demo will be shown at the bi-weekly meeting

Summary Milestone 3:

- We implemented a static dashboard that incorporates all functionalities presented in our figma sketch
- It was challenging to customize the chloropleth to do all of the things we wanted it to do
- Had to implement a workaround for the confidence in the happiness chart, because no library we found directly supported confidence
- Connected everything to our API already
