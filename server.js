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
        inquirer.prompt([{
            type:'input',
            name: 'newEmployeeFirst',
            message: 'What is their first name?'
        },
        {
        type:'input',
        name: 'newEmployeeLast',
        message: 'What is their last name?'
        }
        ]).then((answer)=>{
            const sql = 'INSERT INTO employee (first_name, last_name) VALUE (?)';
            db.promise().query(sql,answer.newEmployeeFirst, answer.newEmployeeLast, (err, result) => {
                if (err) throw err;
                console.log('Employee Added');
                console.table(result);
            }).then(() =>
            startPrompt());
        })



}

startPrompt();






// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
