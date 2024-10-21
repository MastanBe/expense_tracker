from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np

app = Flask(__name__)
CORS(app)

EXPENSES_URL = 'http://localhost:5000/api/expenses/year/{year}'
CATEGORIES_URL = 'http://localhost:5000/api/categories/year/{year}'
MONTHLY_BUDGETS_URL = 'http://localhost:5000/api/monthly-budgets/year/{year}'

def fetch_expenses(token, year):
    """Fetch expenses from the backend."""
    try:
        response = requests.get(
            EXPENSES_URL.format(year=year),
            headers={'Authorization': f'Bearer {token}'}
        )
        response.raise_for_status()
        return response.json().get('expenses', [])
    except requests.RequestException as e:
        print(f"Error fetching expenses: {e}")
        return []

def fetch_categories(token, year):
    """Fetch all categories from the backend."""
    try:
        response = requests.get(
            CATEGORIES_URL.format(year=year),
            headers={'Authorization': f'Bearer {token}'}
        )
        response.raise_for_status()
        data = response.json()
        return {cat['id']: cat['category_name'] for cat in data.get('categories', [])}
    except requests.RequestException as e:
        print(f"Error fetching categories: {e}")
        return {}

def fetch_monthly_budgets(token, year):
    """Fetch monthly budgets from the backend."""
    try:
        response = requests.get(
            MONTHLY_BUDGETS_URL.format(year=year),
            headers={'Authorization': f'Bearer {token}'}
        )
        response.raise_for_status()
        return response.json().get('budgets', [])
    except requests.RequestException as e:
        print(f"Error fetching monthly budgets: {e}")
        return []

def prepare_data(expenses_data, category_mapping, monthly_budgets):
    """Prepare the data for prediction."""
    budget_mapping = {b['id']: (b['month'], b['year']) for b in monthly_budgets}
    prepared_data = []

    for expense in expenses_data:
        category_name = category_mapping.get(expense['categoryId'], "Unknown Category")
        monthly_budget_id = expense.get('monthlyBudgetId')
        month, year = budget_mapping.get(monthly_budget_id, ("Unknown Month", "Unknown Year"))
        prepared_data.append({
            'category': category_name,
            'amount': float(expense['amount']),
            'month': month,
            'year': year
        })
    
    return pd.DataFrame(prepared_data)

def calculate_current_year_expenses(prepared_data, year):
    """Calculate total expenses for the specified year by category."""
    current_year_expenses = prepared_data[prepared_data['year'] == year]
    return current_year_expenses.groupby('category')['amount'].sum().reset_index()

def build_and_predict_next_year_expenses(prepared_data, year):
    """Predict total expenses for the next year using linear regression."""
    next_year = year + 1
    monthly_expenses = prepared_data[prepared_data['year'] == year]
    
    predictions = {}
    for category in monthly_expenses['category'].unique():
        category_data = monthly_expenses[monthly_expenses['category'] == category]
        X = np.array(range(len(category_data))).reshape(-1, 1)  
        y = category_data['amount'].values
        
        model = LinearRegression()
        model.fit(X, y)
        next_year_total = model.predict(np.array([[i] for i in range(12)])).sum()
        predictions[category] = next_year_total

    return predictions

@app.route('/predict_expenses', methods=['GET'])
def predict_expenses():
    """Endpoint to calculate and predict expenses."""
    token = request.headers.get('Authorization').split()[1]
    year = request.args.get('year', type=int)
    if not year:
        return jsonify({'success': False, 'message': 'Year is required'}), 400

    current_year = year - 1
    expenses_data = fetch_expenses(token, current_year)
    category_mapping = fetch_categories(token, current_year)
    monthly_budgets = fetch_monthly_budgets(token, current_year)

    prepared_data = prepare_data(expenses_data, category_mapping, monthly_budgets)

    if prepared_data.empty:
        return jsonify({'success': False, 'message': f'No data exists for the year {current_year}'}), 404

    current_year_expenses = calculate_current_year_expenses(prepared_data, current_year)
    predicted_expenses = build_and_predict_next_year_expenses(prepared_data, current_year)
    print("\n--- Debug Information ---")
    print(f"Expenses Data for Year {current_year}:")
    print(expenses_data)
    print("\nCategory Mapping:")
    print(category_mapping)
    print("\nMonthly Budgets:")
    print(monthly_budgets)
    print("\nPrepared Data:")
    print(prepared_data)
    print("\nCurrent Year Expenses (Year: {current_year}):")
    print(current_year_expenses)
    print("\nPredicted Expenses for Next Year (Year: {next_year}):")
    print(predicted_expenses)
    print("\n--- End of Debug Information ---\n")
    return jsonify({
        'current_year_expenses': current_year_expenses.to_dict(orient='records'),
        'predicted_expenses': {k: f"{v:,.2f}" for k, v in predicted_expenses.items()}
    })

if __name__ == '__main__':
    app.run(debug=True, port=5001)
