# Before And After Prompt Examples

## Example 1: Data Cleaning

### Before

"Clean this dataset."

### After

"Act as a data analyst. Inspect this FoodHub order dataset for missing values, duplicate rows, duplicate order IDs, inconsistent categorical labels, invalid numeric ranges, and data types. Return a checklist, explain why each issue matters, and provide Pandas code for each check."

### Improvement

The revised prompt creates a checklist, defines specific quality checks, and asks for reusable code.

## Example 2: EDA

### Before

"Analyze the data."

### After

"Act as a product analyst. Analyze FoodHub order data to answer five business questions: which restaurants get the most orders, which cuisines are most popular, how cost relates to rating, how delivery time differs by weekday versus weekend, and what operational improvements FoodHub should consider. Use concise explanations and suggest charts for each question."

### Improvement

The revised prompt gives the analysis a business purpose and expected output.

## Example 3: Recommendations

### Before

"What should the company do?"

### After

"Based on these findings, write recommendations for FoodHub's operations team. For each recommendation, include the data point supporting it, the business action, and the expected impact. Avoid claiming causation when the analysis only shows correlation."

### Improvement

The revised prompt forces evidence-based recommendations and reduces unsupported claims.

## Example 4: Reflection

### Before

"Write my reflection."

### After

"Help draft a first-person learning reflection about completing an EDA project. Include what I learned about data quality, AI-assisted analysis, business recommendations, Git workflow, and what I would improve next time. Keep the tone professional and specific."

### Improvement

The revised prompt gives the reflection clear categories and a professional tone.

