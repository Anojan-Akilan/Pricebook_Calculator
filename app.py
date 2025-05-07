from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import os
from typing import Optional

app = Flask(__name__)
CORS(app)

# Load Excel File
excel_path = os.path.join(
    os.path.dirname(__file__), 'price_book.xlsx'
)

# Read raw data without header
df_raw = pd.read_excel(
    excel_path, sheet_name='Commercials', header=None
)

# Find the header row index containing 'Region'
header_row_index: Optional[int] = None
for i, row in df_raw.iterrows():
    if 'Region' in row.values:
        header_row_index = i
        break

if header_row_index is None:
    raise ValueError(
        "Could not find header row containing 'Region' in the Excel file."
    )

# Reload Excel using correct header row
df = pd.read_excel(
    excel_path, sheet_name='Commercials', header=header_row_index
)
df.columns = df.columns.str.strip()  # Clean column names


@app.route('/api/regions', methods=['GET'])
def get_regions():
    regions = df['Region'].dropna().unique().tolist()
    return jsonify(regions)


@app.route('/api/countries', methods=['GET'])
def get_countries():
    region = request.args.get('region')
    countries = df[df['Region'] == region]['Country']
    return jsonify(countries.dropna().unique().tolist())


@app.route('/api/levels', methods=['GET'])
def get_levels():
    region = request.args.get('region')
    country = request.args.get('country')
    levels = df[
        (df['Region'] == region) & (df['Country'] == country)
    ]['Level']
    return jsonify(levels.dropna().unique().tolist())


@app.route('/api/calculate', methods=['POST'])
def calculate_price():
    data = request.json
    region = data.get('region')
    country = data.get('country')
    level = data.get('level')
    term = data.get('term')
    rate_type = data.get('rate_type')

    term_col = f"{term} Term Rate {rate_type}"

    row = df[
        (df['Region'] == region)
        & (df['Country'] == country)
        & (df['Level'] == level)
    ]

    if row.empty or term_col not in df.columns:
        return jsonify({"error": "Pricing not found"}), 404

    price = row.iloc[0][term_col]
    return jsonify({"price": price})


if __name__ == '__main__':
    app.run(debug=True)
