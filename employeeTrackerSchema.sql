DROP DATABASE IF EXISTS employeeTracker_DB;
CREATE DATABASE employeeTracker_DB;

USE employeeTracker_DB;

CREATE TABLE employees(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  title_name VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  salary INT default 0,
  first_name VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
);
