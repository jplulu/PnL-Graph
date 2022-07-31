from flask import Flask, request, g, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect("trades.sqlite")
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

# Return all fills
@app.route('/fills', methods=['GET'])
def getFills():
    cur = get_db().cursor()
    fills = cur.execute("SELECT * from fills ORDER BY timestamp ASC").fetchall()

    payload = {"fills": []}
    for fill in fills:
        fill = dict(fill)
        pnl = fill['fill_price'] * fill['fill_quantity'] - fill['fees']
        fill['pnl'] = pnl if fill['side'] == 'SELL' else -pnl
        payload['fills'].append(fill)
    
    return jsonify(payload), 200

# Return distinct symbols
@app.route('/symbol', methods=['GET'])
def getSymbol():
    cur = get_db().cursor()
    symbols = cur.execute("SELECT DISTINCT symbol FROM fills").fetchall()

    payload = {"symbols": []}
    for symbol in symbols:
        payload['symbols'].append(symbol['symbol'])
    
    return jsonify(payload), 200

# Return distinct exchanges
@app.route('/exchange', methods=['GET'])
def getExchange():
    cur = get_db().cursor()
    exchanges = cur.execute("SELECT DISTINCT exchange FROM fills").fetchall()

    payload = {"exchanges": []}
    for exchange in exchanges:
        payload['exchanges'].append(exchange['exchange'])
    
    return jsonify(payload), 200

if __name__ == '__main__':
    app.run(debug=True)