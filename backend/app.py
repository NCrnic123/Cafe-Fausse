import os
import random
import sqlite3
from contextlib import contextmanager
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
DATABASE_URL = os.getenv('DATABASE_URL')
SQLITE_PATH = os.getenv('SQLITE_PATH', os.path.join(os.path.dirname(__file__), 'cafe_fausse.db'))

@contextmanager
def db_connection():
    if DATABASE_URL:
        import psycopg
        with psycopg.connect(DATABASE_URL) as conn:
            yield conn
    else:
        conn = sqlite3.connect(SQLITE_PATH)
        try:
            yield conn
            conn.commit()
        finally:
            conn.close()

def init_db():
    with db_connection() as conn:
        cur = conn.cursor()
        id_column = 'SERIAL PRIMARY KEY' if DATABASE_URL else 'INTEGER PRIMARY KEY AUTOINCREMENT'
        cur.execute(f'''CREATE TABLE IF NOT EXISTS customers (
          customer_id {id_column}, customer_name TEXT,
          email_address TEXT UNIQUE NOT NULL, phone_number TEXT, newsletter_signup BOOLEAN DEFAULT FALSE)''')
        cur.execute(f'''CREATE TABLE IF NOT EXISTS reservations (
          reservation_id {id_column}, customer_id INTEGER NOT NULL,
          time_slot TEXT NOT NULL, table_number INTEGER NOT NULL, UNIQUE(time_slot, table_number))''')

@app.post('/api/newsletter')
def newsletter():
    email = request.json.get('email', '').strip().lower()
    if '@' not in email or '.' not in email.rsplit('@', 1)[-1]:
        return jsonify(error='Please enter a valid email address.'), 400
    with db_connection() as conn:
        cur = conn.cursor()
        placeholder = '%s' if DATABASE_URL else '?'
        cur.execute(f'SELECT customer_id FROM customers WHERE email_address = {placeholder}', (email,))
        row = cur.fetchone()
        if row:
            cur.execute(f'UPDATE customers SET newsletter_signup = TRUE WHERE customer_id = {placeholder}', (row[0],))
        else:
            cur.execute(f'INSERT INTO customers (email_address, newsletter_signup) VALUES ({placeholder}, TRUE)', (email,))
    return jsonify(message='Subscription saved.'), 201

@app.post('/api/reservations')
def reserve():
    data = request.get_json() or {}
    required = ['date', 'time', 'guests', 'name', 'email']
    if any(not str(data.get(key, '')).strip() for key in required):
        return jsonify(error='Please complete all required fields.'), 400
    try:
        guests = int(data['guests'])
        if not 1 <= guests <= 8: raise ValueError
    except ValueError:
        return jsonify(error='Reservations are available for 1–8 guests.'), 400
    time_slot = f"{data['date']} {data['time']}"
    with db_connection() as conn:
        cur = conn.cursor()
        p = '%s' if DATABASE_URL else '?'
        cur.execute(f'SELECT table_number FROM reservations WHERE time_slot = {p}', (time_slot,))
        used = {row[0] for row in cur.fetchall()}
        available = list(set(range(1, 31)) - used)
        if not available:
            return jsonify(error='That time is fully booked. Please choose another time.'), 409
        cur.execute(f'SELECT customer_id FROM customers WHERE email_address = {p}', (data['email'].lower(),))
        row = cur.fetchone()
        if row: customer_id = row[0]
        else:
            query = f'INSERT INTO customers (customer_name, email_address, phone_number) VALUES ({p}, {p}, {p})'
            if DATABASE_URL:
                cur.execute(query + ' RETURNING customer_id', (data['name'], data['email'].lower(), data.get('phone', '')))
                customer_id = cur.fetchone()[0]
            else:
                cur.execute(query, (data['name'], data['email'].lower(), data.get('phone', '')))
                customer_id = cur.lastrowid
        table = random.choice(available)
        cur.execute(f'INSERT INTO reservations (customer_id, time_slot, table_number) VALUES ({p}, {p}, {p})', (customer_id, time_slot, table))
    return jsonify(message='Reservation confirmed.', table_number=table), 201

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
