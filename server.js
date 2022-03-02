const express = require('express');
const inquirer = require('inquirer');
// Import and require mysql2
const mysql = require('mysql2');

require('dotenv').config()

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: process.env.DB_USER,
        // MySQL password
        password: process.env.DB_PASSWORD,
        database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
);

//view all departments, view all roles, view all employees, add a department, 
//add a role, add an employee, and update an employee role

function startPrompt() {
    inquirer.prompt([{
        type: 'list',
        name: 'select',
        message: 'What would you like to achieve?',
        choices: [
            'view all departments',
            'view all roles',
            'view all employees',
            'add a department',
            'add a role',
            'add an employee',
            'update an employee role',
            'delete a department',
            'delete a role',
            'delte an employee',
            'Exit'
        ]
    }]).then(answer => {
        switch (answer.select) {
            case 'view all departments':
                showDepartment();
                break;

            case 'view all roles':
                showRole();
                break;

            case 'view all employees':
                showEmployee();
                break;

            case 'add a department':
                addDepartment();
                break;

            case 'add a role':
                addRole();
                break;

            case 'add an employee':
                addEmployee();
                break;

            case 'update an employee role':
                updateRole();
                break;

            case 'delete a department':
                deleteDepartment();
                break;

            case 'delete a role':
                deleteRole();
                break;

            case 'delte an employee':
                deleteEmployee();
                break;

            default:
                break;
        }
    });
}

function showDepartment() {
    const sql = 'SELECT * FROM department';

    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log('Showing all departments');
        console.table(result);
        startPrompt();
    })
}

function showRole() {
    const sql = 'SELECT * FROM role';

    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log('Showing all roles');
        console.table(result);
        startPrompt();
    })
}

function showEmployee() {
    const sql = 'SELECT * FROM employees';

    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log('Showing all employees');
        console.table(result);
        startPrompt();
    })
}

function addDepartment() {
    inquirer.prompt([{
        type:'input',
        name: 'departmentAdded',
        message: 'Which department do you want to add?'
    }

    ]).then((answer)=>{
        const sql = 'INSERT INTO department (name) VALUE (?)';
        db.promise().query(sql,answer.departmentAdded, (err, result) => {
            if (err) throw err;
            console.log('Showing all departments');
            console.table(result);
        }).then(() =>
        startPrompt());
    })
}


function addEmployee() {
    inquirer.prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is the first name of the new employee?",
        validate: (value) => {
          if (value) {
            return true;
          } else {
            console.log("Please enter a name");
          }
        }
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the last name of the new employee?",
        validate: (value) => {
          if (value) {
            return true;
          } else {
            console.log("Please enter the last name.");
          }
        }
      },
      {
        name: "role_id",
        type: "number",
        message: "What is their role id?",
        validate: (value) => {
          if (value) {
            return true;
          } else {
            console.log("Please enter the role id.");
          }
        }
      },
      {
        name: "manager_id",
        type: "input",
        message: "What is the manager id?(leave blank if employee is not a manager)",
      }
    ]).then(answer => {
      let manager_id;
      if (answer.manager_id === '') {
        manager_id = null;
      } else {
        manager_id = answer.manager_id;
      }
      const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
      VALUES ('${answer.firstName}', '${answer.lastName}', ${answer.role_id}, ${manager_id})`;

    db.query(sql, (err) => {
      if (err) throw err;
      console.log(`New employee ${answer.firstName} ${answer.lastName} has been added`);
      options();
    })
  });
}


  function addRole() {
    const sql = "SELECT * FROM department";
    db.query(sql, (err, results) => {
      if (err) throw err;
  
      inquirer.prompt([
        {
          name: "title",
          type: "input",
          message: "What is their title?",
          validate: (value) => {
            if (value) {
              return true;
            } else {
              console.log("Please enter the title.");
            }
          }
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary",
          validate: (value) => {
            if (isNaN(value) === false) {
              return true;
            }
            console.log("Please enter a number");
          }
        },
        {
          name: "department_ID",
          type: "rawlist",
          message: "Which department will new role be in?",
          choices: () => {
            let currentDeptIds = [];
            for (let i = 0; i < results.length; i++) {
              currentDeptIds.push(results[i].name);
            }
            return currentDeptIds;
          },
        }
      ]).then(answer => {
        let selectDept;
        for (let i = 0; i < results.length; i++) {
          if (results[i].name === answer.department_ID) {
            selectDept = results[i];
          }
        }
  
        const sql =
          `INSERT INTO employee_role (title, salary, department_id) 
          VALUE ('${answer.title}','${answer.salary}','${selectDept.id}')`;
  
        db.query(sql, (err) => {
          if (err) throw err;
          console.log(`New Role ${answer.title} has been added`);
          startPrompt();
        }
        )
      });
    });
  }

startPrompt();






// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
