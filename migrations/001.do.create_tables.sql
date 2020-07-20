CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    age INTEGER NOT NULL,
    country TEXT NOT NULL,
    nickname TEXT,
    gender TEXT NOT NULL,
    date_created TIMESTAMPTZ NOT NULL DEFAULT now(),
    block_list BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    posterUrl TEXT DEFAULT 'https://imgc.allpostersimages.com/img/print/u-g-PILE2Y0.jpg',
    trailerUrl TEXT,
    summary TEXT DEFAULT 'Not yet available',
    year DATE NOT NULL,
    country TEXT NOT NULL 
);

CREATE TABLE IF NOT EXISTS artists (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    title TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS movie_cast(
    id SERIAL PRIMARY KEY,
    movieId INTEGER REFERENCES movies(id) ON DELETE CASCADE NOT NULL,
    artist_id INTEGER REFERENCES artists(id) ON DELETE CASCADE,
    artist_role TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS reviews(
    id SERIAL PRIMARY KEY,
    movieId INTEGER REFERENCES movies(id) ON DELETE CASCADE NOT NULL,
    userId INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    comment TEXT NOT NULL,
    rating INTEGER NOT NULL,
    upvote INTEGER DEFAULT 0,
    downvote INTEGER DEFAULT 0,
    date_submitted TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reports(
    id SERIAL PRIMARY KEY,
    reviewId INTEGER REFERENCES reviews(id) ON DELETE CASCADE NOT NULL,
    userId INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    reason TEXT NOT NULL,
    date_submitted TIMESTAMPTZ NOT NULL DEFAULT now()
);



