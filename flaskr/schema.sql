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

INSERT INTO users (username, password) VALUES ('admin', 'password123');
