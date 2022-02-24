DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;
 

CREATE TABLE department (
  id INT AUTO_INCREMENT ,
  name VARCHAR(30),
  PRIMARY KEY (id)
);


CREATE TABLE employee_role (
  id INT,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id)
  REFERENCES department(id)
  ON DELETE SET NULL
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id)
    REFERENCES employee_role(id)
    ON DELETE SET NULL,
    CONSTRAINT manager_check FOREIGN KEY (manager_id)
    REFERENCES employee(id)
);