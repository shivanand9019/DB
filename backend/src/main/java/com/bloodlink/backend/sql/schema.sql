DROP TABLE IF EXISTS donations;
DROP TABLE IF EXISTS donor;
DROP TABLE IF EXISTS hospital;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS blood_stock;
DROP TABLE IF EXISTS blood_request;

CREATE TABLE users (
                       user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                       email VARCHAR(100) UNIQUE NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       role VARCHAR(20) NOT NULL,
                       active BOOLEAN DEFAULT TRUE
);

CREATE TABLE donor (
                       donor_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                       user_id BIGINT,
                       full_name VARCHAR(100),
                       gender VARCHAR(10),
                       age INT,
                       blood_group VARCHAR(5),
                       phone VARCHAR(15),
                       city VARCHAR(100),
                       FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE hospital (
                          hospital_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                          user_id BIGINT,
                          name VARCHAR(100),
                          city VARCHAR(100),
                          address VARCHAR(255),
                          phone VARCHAR(15),
                          FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE donations (
                           donation_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                           donor_id BIGINT NOT NULL,
                           hospital_id BIGINT NOT NULL,
                           donation_date DATE,
                           donation_time TIME,
                           blood_quantity DOUBLE DEFAULT 1.0,
                           blood_group VARCHAR(5),
                           status VARCHAR(20) DEFAULT 'PENDING',

                           FOREIGN KEY (donor_id) REFERENCES donor(donor_id),
                           FOREIGN KEY (hospital_id) REFERENCES hospital(hospital_id)
);

CREATE TABLE blood_stock (
                             stock_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                             hospital_id BIGINT NOT NULL,
                             blood_group VARCHAR(5) NOT NULL,
                             units_available DOUBLE DEFAULT 0,

                             FOREIGN KEY (hospital_id) REFERENCES hospital(hospital_id)
);

CREATE TABLE blood_request (
                               request_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                               hospital_id BIGINT NOT NULL,
                               patient_name VARCHAR(100),
                               blood_group VARCHAR(5),
                               units INT,
                               contact VARCHAR(15),
                               status VARCHAR(20) DEFAULT 'Pending',
                               request_date DATE,

                               FOREIGN KEY (hospital_id) REFERENCES hospital(hospital_id)
);