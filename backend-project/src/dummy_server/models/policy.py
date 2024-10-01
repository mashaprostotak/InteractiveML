class Policy:
    def __init__(self, name, cost, indicator, change, years, uncertainty):
        self.name = name
        self.cost = cost
        self.indicator = indicator
        self.change = change
        self.years = years
        self.uncertainty = uncertainty

    def __str__(self):
        return (
            f"Policy {self.name}: "
            f"Cost={self.cost}, "
            f"Indicator={self.indicator}, "
            f"Change={self.change}, "
            f"Years={self.years}, "
            f"Uncertainty={self.uncertainty}"
        )
