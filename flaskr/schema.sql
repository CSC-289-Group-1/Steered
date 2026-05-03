DROP TABLE IF EXISTS preferences;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS bookmarks;

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
    favorite_genre1 TEXT,
    favorite_genre2 TEXT,
    favorite_genre3 TEXT,
    favorite_author1 TEXT,
    favorite_author2 TEXT,
    favorite_author3 TEXT,
    disliked_genre1 TEXT,
    disliked_genre2 TEXT,
    disliked_genre3 TEXT,
    custom_theme_tags TEXT,

    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    book_api_id TEXT NOT NULL,
    bookmarked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    UNIQUE (user_id, book_api_id)
);

INSERT INTO users (username, password) VALUES ('admin', 'scrypt:32768:8:1$n4Yp2d5jqlz0Vhul$742c51790510557aea19e20729e5bef4284601af1e557f6818b0549fe5b72380711b4e2a75d2e37d407e7863eaaa0abd0fae7bc651e705e3c1a0e74044446ca1');
