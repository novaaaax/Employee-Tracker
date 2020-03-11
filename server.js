const util = require('util');
const mysql = require('mysql');
const inquirer = require('inquirer');

require('dotenv').config();

const PORT = process.env.PORT || 8080;
// const db = require('db')
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

connection.connect(function(err){
    if (err) {
        console.log('error connection: ' + err.stack);
        return;
    };
    console.log('connected as id ' + connection.threadId);

    askQuestions();
});

function askQuestions(){
    inquirer.prompt([
        {
            name: 'menuChoices',
            type:'list',
            message: 'Please select from options in the menu',
            choices: ["Add Department", "View Departments", "Add Role", "View Roles", "Update Roles", "Add Employee", "View Employees", "Exit"]
        }
    ]).then(function(menuAnswers){
        if(menuAnswers.menuChoices === "Add Department") {
            addDept();
        } else if(menuAnswers.menuChoices === "View Departments"){
            viewDept();
        } else if(menuAnswers.menuChoices === "Add Role"){
            addRole();
        } else if(menuAnswers.menuChoices === "View Roles") {
            viewRole();
        } else if(menuAnswers.menuChoices === "Update Roles"){
            updateRole();
        }else if(menuAnswers.menuChoices === "Add Employee") {
            addEmployee();
        } else if(menuAnswers.menuChoices === "View Employees"){
            viewEmployees();
        } else {
            connection.end();
        };
    });
};

function addDept() {
    inquirer.prompt([
        {
            name: "deptName",
            type: "input",
            message: "Please enter department name:"
        }
    ]).then(function(deptAnswers){
        var departmentName = deptAnswers.deptName;

        connection.query("INSERT INTO department(name) VALUES(?)", [departmentName],
        function(err, data){
            if(err){
                throw err;
            };
            console.log(`${departmentName} was added successfully!`);
            
            askQuestions();
        });
    });
};

function viewDept() {
    connection.query("SELECT * FROM department", 
    function(err, rows){
        if(err){
            throw err;
        };
        //console.log(rows)
        // console.log('Data received from Db:');
        rows.forEach(function(row){
            console.table(`ID:${row.id} Department Name: ${row.name}`)
        });
        askQuestions();
    });

};

function addRole() {
    inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "Please enter title of role:"
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary of this role?"
        },
        {
            name: "departmentId",
            type: "input",
            message: "What is the department id?"
        }
    ]).then(function(roleAnswers){
        var role = roleAnswers.title;
        var salary = roleAnswers.salary;
        var deptId = roleAnswers.departmentId;

        connection.query(`INSERT INTO role(title, salary, department_id) VALUES('${role}', ${salary}, ${deptId})`,
        function(err, data){
            if(err){
                throw err;
            }
            console.log(`${role} was added successfully!`)

            askQuestions();
        });
    });
};

function viewRole() {
    connection.query("SELECT * FROM role",
    function(err, rows){
        if(err){
            throw err;
        }
        //console.log(rows);
        rows.forEach(function(row){
            console.table(`ID: ${row.id} | Role Name: ${row.title} | Salary: ${row.salary} | Department ID:${row.department_id}`)
        });
        askQuestions();
    });
};

// this was really tough!!!!!!!!!!!!!!!!!
function updateRole(){
    connection.query("SELECT * FROM employee",
    function(err, rows){
        if(err){
            throw err;
        }
        console.table(rows);
        inquirer.prompt([
            {
                name: "employeeId",
                type: "input",
                message: "Please enter ID of employee you would like to update:"
            },
            {
                name: "newRole",
                type: "input",
                message: "Please enter new role ID you would like to assign:"
            }
        ]).then(function(res){
            connection.query(`UPDATE employee SET role_id = ${res.newRole}`,
            function(err){
                if(err){
                    throw err;
                }
                console.log("Success! Role has been updated!")

                askQuestions();
            })
        })
    });
}

function addEmployee() {
    inquirer.prompt([
        {
            name: "first",
            type: "input",
            message: "Please enter employee's first name:"
        },
        {
            name: "last",
            type: "input",
            message: "Please enter employee's last name:"
        },
        {
            name: "manager",
            type: "input",
            message: "Enter their manager's ID:"
        },
        {
            name: "role",
            type: "input",
            message: "Enter role ID:"
        }
    ]).then(function(employeeAnswers){
        var firstName = employeeAnswers.first;
        var lastName = employeeAnswers.last;
        var managerId = employeeAnswers.manager;
        var roleId =  employeeAnswers.role;

        connection.query(`INSERT INTO employee(first_name, last_name, manager_id, role_id) VALUES('${firstName}', '${lastName}', ${managerId}, ${roleId})`,
        function(err, data){
            if(err){
                throw err;
            }
            console.log(`${firstName} was added successfully!`);

            askQuestions();
        });
    });
};

function viewEmployees() {
connection.query("SELECT * FROM employee",
function(err, rows){
    if(err){
        throw err;
    };
    //console.log(rows);
    rows.forEach(function(row){
        console.table(`ID: ${row.id} | Name: ${row.first_name} ${row.last_name} | Role ID: ${row.role_id} | Manager ID: ${row.manager_id}`)
    });
    askQuestions();
});
};

// app.listen(PORT, function() {
//     console.log('Listening on port ' + PORT);
// });

// connection.query = util.promisify(connection.query);

// module.exports = connection;