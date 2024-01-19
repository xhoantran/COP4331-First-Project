-- Path: config/initdb/init.sql

CREATE DATABASE IF NOT EXISTS contact_manager;
USE contact_manager;

CREATE TABLE users (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `username` VARCHAR(45) NULL,
  `password` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));

CREATE TABLE contacts (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `phone` VARCHAR(45) NULL,
  `email` VARCHAR(45) NULL,
  `user_id` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_contacts_users_idx` (`user_id` ASC),
  CONSTRAINT `fk_contacts_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
