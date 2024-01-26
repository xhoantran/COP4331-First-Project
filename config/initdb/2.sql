-- Path: config/initdb/2.sql

USE contact_manager;

-- Fixture data for the "users" table
INSERT INTO users (name, username, password) VALUES ('John Doe', 'john', 'john');
INSERT INTO users (name, username, password) VALUES ('Jane Doe', 'jane', 'jane');

-- Fixture data for the "contacts" table
INSERT INTO contacts (name, phone, email, user_id) VALUES ('John Doe1', '555-555-5555', 'john.doe@domain.com', 1);
INSERT INTO contacts (name, phone, email, user_id) VALUES ('John Doe2', '555-555-5555', 'john.doe@domain.com', 1);
INSERT INTO contacts (name, phone, email, user_id) VALUES ('John Doe3', '555-555-5555', 'john.doe@domain.com', 1);
INSERT INTO contacts (name, phone, email, user_id) VALUES ('John Doe4', '555-555-5555', 'john.doe@domain.com', 1);
INSERT INTO contacts (name, phone, email, user_id) VALUES ('John Doe5', '555-555-5555', 'john.doe@domain.com', 1);
INSERT INTO contacts (name, phone, email, user_id) VALUES ('John Doe6', '555-555-5555', 'john.doe@domain.com', 1);
INSERT INTO contacts (name, phone, email, user_id) VALUES ('John Doe7', '555-555-5555', 'john.doe@domain.com', 1);
INSERT INTO contacts (name, phone, email, user_id) VALUES ('John Doe8', '555-555-5555', 'john.doe@domain.com', 1);
INSERT INTO contacts (name, phone, email, user_id) VALUES ('John Doe9', '555-555-5555', 'john.doe@domain.com', 1);
INSERT INTO contacts (name, phone, email, user_id) VALUES ('John Doe10', '555-555-5555', 'john.doe@domain.com', 1);
INSERT INTO contacts (name, phone, email, user_id) VALUES ('John Doe11', '555-555-5555', 'john.doe@domain.com', 1);
INSERT INTO contacts (name, phone, email, user_id) VALUES ('John Doe12', '555-555-5555', 'john.doe@domain.com', 1);
INSERT INTO contacts (name, phone, email, user_id) VALUES ('John Doe13', '555-555-5555', 'john.doe@domain.com', 1);
INSERT INTO contacts (name, phone, email, user_id) VALUES ('John Doe14', '555-555-5555', 'john.doe@domain.com', 1);
INSERT INTO contacts (name, phone, email, user_id) VALUES ('John Doe15', '555-555-5555', 'john.doe@domain.com', 1);
INSERT INTO contacts (name, phone, email, user_id) VALUES ('John Doe16', '555-555-5555', 'john.doe@domain.com', 1);
INSERT INTO contacts (name, phone, email, user_id) VALUES ('John Doe17', '555-555-5555', 'john.doe@domain.com', 1);
INSERT INTO contacts (name, phone, email, user_id) VALUES ('John Doe18', '555-555-5555', 'john.doe@domain.com', 1);
INSERT INTO contacts (name, phone, email, user_id) VALUES ('John Doe19', '555-555-5555', 'john.doe@domain.com', 1);
INSERT INTO contacts (name, phone, email, user_id) VALUES ('John Doe20', '555-555-5555', 'john.doe@domain.com', 1);
INSERT INTO contacts (name, phone, email, user_id) VALUES ('John Doe21', '555-555-5555', 'john.doe@domain.com', 1);
INSERT INTO contacts (name, phone, email, user_id) VALUES ('John Doe22', '555-555-5555', 'john.doe@domain.com', 1);
INSERT INTO contacts (name, phone, email, user_id) VALUES ('John Doe23', '555-555-5555', 'john.doe@domain.com', 1);

INSERT INTO contacts (name, phone, email, user_id) VALUES ('Jane Doe', '555-555-5555', 'jane.doe@domain.com', 2);
