DROP TABLE IF EXISTS preferences;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    favorite_genre TEXT,
    favorite_author TEXT,
    disliked_genre TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

INSERT INTO users (username, password) VALUES ('admin', 'scrypt:32768:8:1$n4Yp2d5jqlz0Vhul$742c51790510557aea19e20729e5bef4284601af1e557f6818b0549fe5b72380711b4e2a75d2e37d407e7863eaaa0abd0fae7bc651e705e3c1a0e74044446ca1');
