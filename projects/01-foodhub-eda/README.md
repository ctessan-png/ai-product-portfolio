# FoodHub EDA Project

## Objective

The goal of this project is to analyze FoodHub order data and identify patterns in customer behavior, restaurant demand, cuisine popularity, delivery performance, and ratings.

## Business Questions

1. Which restaurants receive the most orders?
2. Which cuisine types are most popular?
3. Do higher-cost orders receive better ratings?
4. Are preparation and delivery times different on weekdays vs weekends?
5. What operational improvements could FoodHub make?

## Dataset

The dataset includes 1,898 order-level records with the following fields:

- order ID
- customer ID
- restaurant name
- cuisine type
- cost of order
- day of week
- rating
- food preparation time
- delivery time

## Methods

- Data inspection
- Missing value treatment
- Duplicate checks
- Summary statistics
- Univariate analysis
- Bivariate analysis
- Business recommendations

## Tools Used

- Python
- Pandas
- Matplotlib
- Seaborn
- Jupyter Notebook
- Git/GitHub
- ChatGPT for AI-assisted analysis and documentation support

## Key Findings

1. Weekend demand is much higher than weekday demand, with 1,351 weekend orders compared with 547 weekday orders.
2. American, Japanese, Italian, and Chinese cuisines account for most order volume.
3. Shake Shack is the highest-volume restaurant with 219 orders.
4. Ratings are incomplete: 736 orders are marked as `Not given`, which limits rating analysis.
5. Order cost and rating have almost no linear relationship in the rated records, with an estimated correlation near 0.03.

## Recommendations

1. Staff and delivery capacity should be planned around weekend demand peaks.
2. FoodHub should improve rating capture because nearly 39% of orders have no rating.
3. High-volume restaurants should be monitored for delivery and preparation consistency.
4. Cuisine-level demand should inform promotions, featured restaurant placement, and partnership decisions.
5. Rating analysis should be separated from unrated orders to avoid misleading conclusions.

## Reflection

This project helped me understand how exploratory data analysis can support decision-making in real-world food delivery operations. The most important lesson was that data analysis is not only about generating charts. It is about asking useful questions, checking data quality, and translating patterns into operational recommendations.

