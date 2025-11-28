-- USERS
CREATE PROCEDURE register_user(
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255),
    IN p_role VARCHAR(20)
)
BEGIN
INSERT INTO users(email,password,role) VALUES(p_email,p_password,p_role);
END;

CREATE PROCEDURE login_user(IN p_email VARCHAR(100))
BEGIN
SELECT * FROM users WHERE email = p_email AND active = TRUE;
END;

-- DONATIONS
CREATE PROCEDURE create_donation(
    IN p_donor BIGINT,
    IN p_hospital BIGINT,
    IN p_date DATE,
    IN p_time TIME
)
BEGIN
INSERT INTO donations(donor_id,hospital_id,donation_date,donation_time,blood_group,blood_quantity,status)
VALUES(
          p_donor,
          p_hospital,
          p_date,
          p_time,
          (SELECT blood_group FROM donor WHERE donor_id = p_donor),
          1.0,
          'PENDING'
      );
END;

CREATE PROCEDURE update_donation_status(
    IN p_id BIGINT,
    IN p_status VARCHAR(20)
)
BEGIN
UPDATE donations SET status = p_status WHERE donation_id = p_id;
END;

-- DONATION HISTORY
CREATE PROCEDURE get_donations_by_hospital(IN p_id BIGINT)
BEGIN
SELECT d.*, o.full_name as donor_name
FROM donations d
         JOIN donor o ON d.donor_id = o.donor_id
WHERE d.hospital_id = p_id;
END;

CREATE PROCEDURE get_donations_by_donor(IN p_id BIGINT)
BEGIN
SELECT * FROM donations WHERE donor_id = p_id;
END;

-- BLOOD STOCK
CREATE PROCEDURE update_stock(
    IN p_hospital BIGINT,
    IN p_group VARCHAR(5),
    IN p_units DOUBLE
)
BEGIN
INSERT INTO blood_stock(hospital_id,blood_group,units_available)
VALUES(p_hospital,p_group,p_units)
    ON DUPLICATE KEY UPDATE units_available = units_available + p_units;
END;