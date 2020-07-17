var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 8080,

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
      choices: ["View All Employees by Department", "View all Employees by Manager", "Add Employees","Remove Employee","Update Employee Role","Update Employee Manager","View All Roles"]
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
      else if(answer.selectionChoice === "Remove Employee") {
        deleteEmployee();
        
      }
      else if(answer.selectionChoice === "Update Employee Role") {
        updateRole();
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
}


// function to view all employees

function viewAll(){
  connection.query("SELECT * FROM employees", function(err, results) {
    var employeeArray = [];
            for (var i = 0; i < results.length; i++) {
              employeeArray.push(results[i].employee);
            }
            return employeeArray;
})
start();
}

// function to view employees by department
function viewDepartment(){
  connection.query("SELECT * FROM employees", function(err, results) {
    if (err) throw err;
  inquirer
    .prompt([{
      name: "choice",
      type: "department",
      choices: function() {
        var choiceArray = [];
        for (var i = 0; i < results.length; i++) {
          choiceArray.push(results[i].department);
        }
        return choiceArray;
      }
    }])

    .then(function(answer) {
      let employeeDepartment = [];
        for (var i = 0; i < results.length; i++) {
          if (results[i].department === answer.choice) {
            employeeDepartment.push(results[i]);
          }
        }
        return employeeDepartment;
    })
 })
start();
}

// function to view employees by manager
function viewManager(){
  connection.query("SELECT * FROM employees", function(err, results) {
    if (err) throw err;
  inquirer
    .prompt([{
      name: "choice",
      type: "manager",
      choices: function() {
        let choiceArray = [];
        for (var i = 0; i < results.length; i++) {
          choiceArray.push(results[i].manager);
        }
        return choiceArray;
      }
    }])

    .then(function(answer) {
      let employeeManager = [];
        for (var i = 0; i < results.length; i++) {
          if (results[i].department === answer.choice) {
            employeeManager.push(results[i]);
          }
        }
        return employeeManager;
    })
 })
 start();
}

// function to add a new employee
function addEmployee() {
  connection.query("SELECT * FROM employees", function(err, results) {
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
        name: "title",
        type: "rawlist",
        choices: function() {
          var titleArray = [];
          for (var i = 0; i < results.length; i++) {
            choiceArray.push(results[i].title);
          }
          return titleArray;
        },
        message: "What is the employee's role?"
      },
      {
        name: "department",
        type: "rawlist",
        choices: function() {
          var departmentArray = [];
          for (var i = 0; i < results.length; i++) {
            choiceArray.push(results[i].department);
          }
          return departmentArray;
        },
        message: "What department is the employee in?"
      },     
      {
        name: "salary",
        type: "input",
        message: "What is the employee's salary?"
      },
      {
        name: "manager",
        type: "rawlist",
        choices: function() {
          var managerArray = [];
          for (var i = 0; i < results.length; i++) {
            choiceArray.push(results[i].manager);
          }
          return managerArray;
        },
        message: "Who is the employee's manager?"
      }      
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO employees SET ?",
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          title: answer.title,
          department: answer.department,
          salary: answer.salary,
          manager: answer.manager,
          
        },
        function(err) {
          if (err) throw err;
          console.log("New Empoyee Added!");
          start();
        }
      );
    });
  })
  start();
}





// function to renove an employee -could cause an issue if multiple employees have the same name
function deleteEmployee(){
  connection.query("SELECT * FROM employees", function(err, results) {
    if (err) throw err;
  inquirer
    .prompt([{
      name: "choice",
      type: "employee",
      choices: function() {
        var choiceArray = [];
        for (var i = 0; i < results.length; i++) {
          choiceArray.push(results[i].employee);
        }
        return choiceArray;
      }
    }])

    .then(function(answer) {
      connection.query(
        "Delete employee WHERE ? = ??",
        [
          {
            first_name: answer.bid
          },
          {
            id: chosenItem.id
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
 start();
}

// function to update the employees role
function updateRole() {
  connection.query("SELECT * FROM employees", function(err, results) {
    if (err) throw err;
  inquirer
    .prompt([{
      name: "employee",
      type: "choice",
      choices: function() {
        let employeeArray = [];
        for (var i = 0; i < results.length; i++) {
          choiceArray.push(results[i].employee);
        }
        return choiceArray;
      }
    },
    {
      name: "role",
      type: "choice",
      choices: function() {
        let roleArray = [];
        for (var i = 0; i < results.length; i++) {
          roleArray.push(results[i].role);
        }
        return roleArray;
      }
    }

  ])
      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].item_name === answer.choice) {
            chosenItem = results[i];
          }
        }
          // bid was high enough, so update db, let the user know, and start over
          connection.query(
            "UPDATE employees SET ? WHERE ?",
            [
              {
                role: answer.role
              },
              {
                // need to fix
                id: id
              }
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
  connection.query("SELECT * FROM employees", function(err, results) {
    if (err) throw err;
  inquirer
    .prompt([{
      name: "employee",
      type: "choice",
      choices: function() {
        let employeeArray = [];
        for (var i = 0; i < results.length; i++) {
          choiceArray.push(results[i].employee);
        }
        return choiceArray;
      }
    },
    {
      name: "manager",
      type: "choice",
      choices: function() {
        let managerArray = [];
        for (var i = 0; i < results.length; i++) {
          managerArray.push(results[i].role);
        }
        return managerArray;
      }
    }

  ])
      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].item_name === answer.choice) {
            chosenItem = results[i];
          }
        }
          // bid was high enough, so update db, let the user know, and start over
          connection.query(
            "UPDATE employees SET ? WHERE ?",
            [
              {
                role: answer.manager
              },
              {
                // need to fix
                id: id
              }
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




