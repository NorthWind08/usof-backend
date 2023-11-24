USE ucode_web;

CREATE TABLE IF NOT EXISTS user(
                                    id INT PRIMARY KEY AUTO_INCREMENT,
                                    login VARCHAR(50) NOT NULL,
                                    password VARCHAR(64) NOT NULL,
                                    token VARCHAR(255) NOT NULL,
                                    fname VARCHAR(255) NOT NULL,
                                    lname VARCHAR(255) NOT NULL,
                                    email VARCHAR(255) NOT NULL,
                                    rating INT,
                                    profile_picture_link VARCHAR(255),
                                    role ENUM('user', 'admin') DEFAULT 'user',
                                    isVerified BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS post(
                                    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
                                    author INT NOT NULL,
                                    title TEXT NOT NULL,
                                    content TEXT NOT NULL,
                                    status ENUM('active', 'inactive') NOT NULL,
                                    categories BIGINT NOT NULL,
                                    publish_date TIMESTAMP NOT NULL,
                                    FOREIGN KEY (author) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS category(
                                         id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
                                         title VARCHAR(255) NOT NULL,
                                         description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS posts_categories(
                                               category_id INT,
                                               post_id INT,
                                               FOREIGN KEY (category_id) REFERENCES category(id),
                                               FOREIGN KEY (post_id) REFERENCES post(id)
);

CREATE TABLE IF NOT EXISTS comment(
                                       id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                                       content TEXT NOT NULL,
                                       date TIMESTAMP NOT NULL,
                                       post INT,
                                       FOREIGN KEY (post) REFERENCES post(id)
);

CREATE TABLE IF NOT EXISTS 'like'(
                                    id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                    user BIGINT,
                                    type ENUM('like', 'dislike'),
                                    entity_type ENUM('post', 'comment'),
                                    entity_id INT,
                                    FOREIGN KEY (user) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS verification_codes(
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(5) UNIQUE NOT NULL,
    userID BIGINT UNSIGNED NOT NULL
);