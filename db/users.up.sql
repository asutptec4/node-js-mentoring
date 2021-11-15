CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    login VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    age SMALLINT NOT NULL,
    is_deleted BOOLEAN DEFAULT false,
    
    CONSTRAINT user_unique_login UNIQUE (login),
    CONSTRAINT user_age_range CHECK ((age >= 4) AND (age) <= 130)
);

CREATE INDEX user_index_login ON users(login);

INSERT INTO users(login, password, age) VALUES ('admin', 'password', 20);
INSERT INTO users(login, password, age) VALUES ('user', '12345678', 30);
INSERT INTO users(login, password, age) VALUES ('vasia', 'vasia', 40);
