
INSERT INTO department (name)
VALUES 
    ("HR"),
    ("Accounting"),
    ("Engineering");

INSERT INTO employee_role (title, salary, department_id)
VALUES
    ("Boss", 30000, 1),
    ("CFO", 60000, 1),
    ("Entry-Level", 20000, 2),
    ("Senior sale", 30000, 3),
    ("Senior HR", 35000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("tyler", "Gandy", 1, NULL),
    ("tyler", "Benjamin", 2, 1),
    ("Johny", "Bravo", 3, NULL);