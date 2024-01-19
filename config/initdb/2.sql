-- Path: config/initdb/2.sql

USE contact_manager;

-- Fixture data for the "users" table
INSERT INTO users (name, username, password) VALUES ('John Doe', 'john', 'john');
INSERT INTO users (name, username, password) VALUES ('Jane Doe', 'jane', 'jane');

-- Fixture data for the "contacts" table
INSERT INTO contacts (name, phone, email, user_id) VALUES ('John Doe', '555-555-5555', 'john.doe@domain.com', 1);
INSERT INTO contacts (name, phone, email, user_id) VALUES ('Jane Doe', '555-555-5555', 'jane.doe@domain.com', 2);
