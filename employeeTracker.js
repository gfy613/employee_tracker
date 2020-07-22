var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "1Ye!lding2",
  database: "employeeTracker_DB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "selectionChoice",
      type: "list",
      message: "what would you like to do?",
      choices: ["View All Employees by Department", "View all Employees by Manager", "Add Employees","Add Role","Add Department","Remove Employee","Update Employee Role","Update Employee Manager","View All Roles","Exit"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.selectionChoice === "View All Employees by Department") {
        viewDepartment();       
      }
      else if(answer.selectionChoice === "View all Employees by Manager") {
        viewManager();
      } 
      else if(answer.selectionChoice === "Add Employees") {
        addEmployee();
      }
      else if(answer.selectionChoice === "Add Role") {
        addRole();
      }
      else if(answer.selectionChoice === "Add Department") {
        addDepartment();
      }
      else if(answer.selectionChoice === "Remove Employee") {
        deleteEmployee();
      }
      else if(answer.selectionChoice === "Update Employee Role") {
        updateRole()
      }
      else if(answer.selectionChoice === "Update Employee Manager") {
        updateManager();
      }
      else if(answer.selectionChoice === "View All Roles") {
        viewAll();
      }      
      else{
        connection.end();
      }
    });
};


// function to view all employees 

function viewAll(){
let query =
`Select e.id,e.first_name,e.last_name,r.title, d.name,r.salary, e.manager_id
      
from employees e
join role r
on r.id = e.role_id
join department d
on d.id = r.department_id
`

 connection.query(query, function(err, results) {
  if (err) throw err; 
  console.log("All Current employees")
  console.table(results)
  start();
})

};



// function to view employees by department
function viewDepartment(){
  connection.query("SELECT * FROM department", function(err, results) {
    if (err) throw err;
    // console.log(results)
  inquirer
    .prompt({
      name: "department",
      type: "list",
      message: "Which department?",
      choices: function() {
        var choiceArray = [];
        for (var i = 0; i < results.length; i++) {
          choiceArray.push(results[i].name);
        }
        return choiceArray;
      },
    })
    .then(function(answer) {
      console.log(answer)
      let dquery = 
      `Select e.id,e.first_name,e.last_name,r.title, name,r.salary,e.manager_id
      
      from employees e
      join role r
      on r.id = e.role_id
      join department d
      on d.id = r.department_id

      Where ?
      `

      connection.query(dquery,[{name: answer.department}], function(err, res) {
        if (err) throw err;

      console.table(res)
      start()
    })
 })

})
};


// function to view employees by manager
function viewManager(){
  connection.query("SELECT * FROM employees Where manager_id IS NOT NULL", function(err, results) {
    if (err) throw err;
  inquirer
    .prompt({
      name: "manager",
      type: "list",
      message: "Choose manager by id?",
      choices: function() {
        var choiceMArray = [];
        for (var i = 0; i < results.length; i++) {
          choiceMArray.push(results[i].manager_id);
        }
        return choiceMArray;
      },
    })

    .then(function(answer) {

      let mquery = 
      `Select e.id,e.first_name,e.last_name,r.title, d.name,r.salary,manager_id
      from employees e
      join role r
      on r.id = e.role_id
      join department d
      on d.id = r.department_id

      where ?
      `

      connection.query(mquery,[{manager_id: answer.manager}], function(err, results) {
        if (err) throw err;

      console.table(results)
      start();
    })
 })
 })

}

// function to renove an employee 
function deleteEmployee(){
  connection.query("SELECT * FROM employees", function(err, results) {
    if (err) throw err;
  inquirer
    .prompt([{
      name: "employeeId",
      type: "list",
      choices: results.map(employee=>
         {return {name: employee.first_name+" "+employee.last_name, value: employee.id} })
              
    }])

    .then(function(answer) {
      connection.query(
        "Delete From employees WHERE ? ",
        [
          {
            id: answer.employeeId
          }
        ],
        function(error) {
          if (error) throw err;
          console.log("Employee removed.");
          start();
        }
      );
    })
 })
}

// function to update the employees role
function updateRole() {
  let query =
`Select e.id,e.first_name,e.last_name,e.role_id,r.title, d.name,r.salary, e.manager_id
      
from employees e
join role r
on r.id = e.role_id
join department d
on d.id = r.department_id
`
  connection.query(query, function(err, results) {
    if (err) throw err;
  inquirer
    .prompt([{
      name: "employee",
      type: "list",
      choices: results.map(employee=>
        {return {name: employee.first_name+" "+employee.last_name, value: employee.id} })

    },
    {
      name: "role",
      type: "list",
      choices: results.map(role=>
        {return {name: role.title, value: role.role_id} })
    }

  ])
      .then(function(answer) {
      console.log(answer)
          // bid was high enough, so update db, let the user know, and start over
          connection.query(
            "UPDATE employees SET ? WHERE id = ?",
            [
              {
                role_id: answer.role
              },
               answer.employee
              
            ],
            function(error) {
              if (error) throw err;
              console.log("Employee role updated!");
              start();
            }
          );

      });
  });
}

// function to update the employees role
function updateManager() {
  let query =
`Select e.id,e.first_name,e.last_name,e.role_id,r.title, d.name,r.salary, e.manager_id
      
from employees e  
join role r
on r.id = e.role_id
join department d
on d.id = r.department_id
`
  connection.query(query, function(err, results) {
    if (err) throw err;
  inquirer
    .prompt([{
      name: "employee",
      type: "list",
      choices: results.map(employee=>
        {return {name: employee.first_name+" "+employee.last_name, value: employee.id} })

    },
    {
      name: "manager",
      type: "input",
      message: "what is the new manager's id?"
    }

  ])
      .then(function(answer) {
      console.log(answer)
          // bid was high enough, so update db, let the user know, and start over
          connection.query(
            "UPDATE employees SET ? WHERE id = ?",
            [
              {
                manager_id: answer.manager
              },
               answer.employee
              
            ],
            function(error) {
              if (error) throw err;
              console.log("Employee manager updated!");
              start();
            }
          );

      });
  });
}


// function to add a new employee
function addEmployee() {
  let query =
`Select e.id,e.first_name,e.last_name,e.role_id,r.title, d.name,r.salary, e.manager_id
      
from employees e
join role r
on r.id = e.role_id
join department d
on d.id = r.department_id
`

  connection.query(query, function(err, results) {
    if (err) throw err;
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "What is the employee's first name?"
      },
      {
        name: "last_name",
        type: "input",
        message: "What is the employee's last name?"
      },
      {
        name: "role",
        type: "list",
        message: "What is the employee's role?",
        choices: results.map(role=>
          {return {name: role.title, value: role.role_id} })        
      },
      {
        name: "manager",
        type: "input",
        message: "what is the new manager's id?"
      }     
    ])
    .then(function(answer) {
      console.log(answer)
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)",
        [
          answer.first_name,
          answer.last_name,
          answer.role,
          answer.manager,
        ]
        ,
        function(err) {
          if (err) throw err;
          console.log("New Empoyee Added!");
          start();
        }
      );
    });
  })

}

function addRole() {
  connection.query("SELECT * FROM department", function(err, results) {
    if (err) throw err;
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "What is the role's name?"
      },
      {
        name: "salary",
        type: "input",
        message: "What is the role's salary?"
      },
      {
        name: "department",
        type: "list",
        message: "What department is the role in",
        choices: results.map(department=>
          {return {name: department.name, value: department.department_id} })        
      },
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO role (title,salary,department_id) values(?,?,?)",
        [
          answer.title,
          answer.salary,
          answer.department
        ],
        function(err) {
          if (err) throw err;
          console.log("New role Added!");
          start();
        }
      );
    });
  })
}

function addDepartment() {
  connection.query("SELECT * FROM role", function(err, results) {
    if (err) throw err;
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "What is the new department's name?"
      }
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO department (name) VALUES (?)",
        [
          answer.department,
        ],
        function(err) {
          if (err) throw err;
          console.log("New department Added!");
          start();
        }
        );
      })
   })  
  }


