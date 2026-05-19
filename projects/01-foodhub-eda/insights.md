# FoodHub EDA Insights

## Dataset Snapshot

- Total orders: 1,898
- Duplicate rows: 0
- Blank missing values: 0
- Ratings marked `Not given`: 736
- Rated orders: 1,162

## Demand Insights

Weekend orders make up the majority of demand. The dataset includes 1,351 weekend orders and 547 weekday orders. This suggests FoodHub should treat weekends as a high-capacity operating period for delivery staffing, restaurant coordination, and customer support.

## Restaurant Performance

The highest-volume restaurants are:

| Rank | Restaurant | Orders |
| --- | --- | ---: |
| 1 | Shake Shack | 219 |
| 2 | The Meatball Shop | 132 |
| 3 | Blue Ribbon Sushi | 119 |
| 4 | Blue Ribbon Fried Chicken | 96 |
| 5 | Parm | 68 |

High-volume restaurants should be reviewed closely because operational problems at these restaurants could affect a large share of customer experiences.

## Cuisine Demand

The most common cuisine types are:

| Rank | Cuisine | Orders |
| --- | --- | ---: |
| 1 | American | 584 |
| 2 | Japanese | 470 |
| 3 | Italian | 298 |
| 4 | Chinese | 215 |
| 5 | Mexican | 77 |

American and Japanese cuisine drive the most order activity. This could influence promotions, homepage placement, and restaurant acquisition strategy.

## Cost, Rating, And Time Patterns

- Average order cost: $16.50
- Median order cost: $14.14
- Average food preparation time: 27.37 minutes
- Average delivery time: 24.16 minutes
- Weekday average delivery time: 28.34 minutes
- Weekend average delivery time: 22.47 minutes
- Estimated cost-to-rating correlation among rated orders: 0.03

Higher-cost orders do not appear to receive meaningfully higher ratings in this dataset. Delivery time differs more clearly by day type, with weekday delivery taking longer on average.

## Business Recommendations

1. Improve rating capture with a simple post-delivery prompt or incentive.
2. Plan delivery capacity around weekend volume and weekday delivery-time risk.
3. Track high-volume restaurants with a simple operational scorecard.
4. Use cuisine demand to inform promotions and restaurant partnership priorities.
5. Treat missing ratings as a business signal, not only a data cleaning issue.

