CREATE DATABASE hackathon_checkin;


CREATE TABLE hackers (
    id INTEGER PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    preferred_name VARCHAR(100),
    pronouns VARCHAR(50),
    shirt_size VARCHAR(10),
    dietary_restrictions TEXT,
    checked_in BOOLEAN DEFAULT FALSE,
    swag BOOLEAN DEFAULT FALSE,
    friday_dinner BOOLEAN DEFAULT FALSE,
    saturday_breakfast BOOLEAN DEFAULT FALSE,
    saturday_lunch BOOLEAN DEFAULT FALSE,
    saturday_dinner BOOLEAN DEFAULT FALSE,
    sunday_breakfast BOOLEAN DEFAULT FALSE
);

-- Insert sample data
INSERT INTO hackers (
    id, first_name, last_name, preferred_name, pronouns, shirt_size, dietary_restrictions, checked_in, swag,friday_dinner, saturday_breakfast, saturday_lunch, saturday_dinner, sunday_breakfast
) VALUES 
(1001, 'John', 'Doe', 'Did', 'She/her', 'S', 'N/A', FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE),
(1002, 'Aryan', 'Kansagara', NULL, 'he/him', 'M', 'N/A', FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE);