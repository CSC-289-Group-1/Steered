import os
from flask import Flask, render_template, redirect, url_for, session, request
from werkzeug.security import check_password_hash, generate_password_hash
from .db import get_db, init_app


def create_app():
    app = Flask(__name__)
    app.config.from_mapping(
        SECRET_KEY='change-this-in-production',
        DATABASE=os.path.join(app.instance_path, 'steered.sqlite'),
    )

    os.makedirs(app.instance_path, exist_ok=True)

    init_app(app)

    @app.route('/')
    def index():
        return 'Hello, World! Your Flask app is running. <a href="/login">Go to Login</a>'

    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if request.method == 'POST':
            username = request.form['username']
            password = request.form['password']
            db = get_db()
            error = None

            user = db.execute(
                'SELECT * FROM users WHERE username = ?', (username,)
            ).fetchone()

            if user is None or not check_password_hash(user['password'], password):
                error = 'Invalid username or password.'

            if error is None:
                session.clear()
                session['user_id'] = user['id']
                session['username'] = user['username']
                return redirect(url_for('dashboard'))

            return render_template('login.html', error=error)

        return render_template('login.html')

    @app.route('/dashboard')
    def dashboard():
        username = session.get('username')
        if not username:
            return redirect(url_for('login'))
        return render_template('dashboard.html', username=username)

    @app.route('/logout')
    def logout():
        session.clear()
        return redirect(url_for('login'))

    return app
