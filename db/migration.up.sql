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
INSERT INTO users(login, password, age) VALUES ('boring_user', '12345678', 30);
INSERT INTO users(login, password, age) VALUES ('vasia', 'vasia', 40);

CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    permissions VARCHAR(255) ARRAY,
    
    CONSTRAINT group_unique_name UNIQUE (name)
);

CREATE INDEX group_index_name ON groups(name);

INSERT INTO groups(name, permissions) VALUES ('admin', ARRAY['READ', 'WRITE', 'DETETE', 'SHARE', 'UPLOAD_FILES']);
INSERT INTO groups(name, permissions) VALUES ('user', ARRAY['READ', 'WRITE', 'SHARE', 'UPLOAD_FILES']);
INSERT INTO groups(name, permissions) VALUES ('guest', ARRAY['READ']);

CREATE TABLE users_groups (
    user_id UUID NOT NULL REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES groups (id) ON UPDATE CASCADE ON DELETE CASCADE
);

INSERT INTO users_groups (user_id, group_id) VALUES ((SELECT id FROM users WHERE users.login = 'admin'), (SELECT id FROM groups WHERE groups.name = 'admin'));
INSERT INTO users_groups (user_id, group_id) VALUES ((SELECT id FROM users WHERE users.login = 'boring_user'), (SELECT id FROM groups WHERE groups.name = 'user'));
INSERT INTO users_groups (user_id, group_id) VALUES ((SELECT id FROM users WHERE users.login = 'vasia'), (SELECT id FROM groups WHERE groups.name = 'guest'));
