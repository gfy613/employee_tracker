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
        start();
        
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
  return console.table(results)
  
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
    })
 })

})
start();
};


// function to view employees by manager
function viewManager(){
  connection.query("SELECT * FROM employees", function(err, results) {
    if (err) throw err;
  inquirer
    .prompt({
      name: "manager",
      type: "list",
      message: "Choose manager by id?",
      choices: function() {
        var choiceMArray = [];
        for (var i = 0; i < results.length; i++) {
          if(results[i].manager_id != NULL){
          choiceMArray.push(results[i].manager_id);
          };
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
      type: "choice",
      choices: results.map(employee=>
         {return {name: employee.first_name+" "+employee.last_name, value: employee.id} })
              
    }])

    .then(function(answer) {
      connection.query(
        "Delete employee WHERE ? ",
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
      choices: results.map(employee=>
         {return {name: employee.first_name+" "+employee.last_name, value: employee.id} })
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

// function to update the employees manager
function updateManger() {
  connection.query("SELECT * FROM employees", function(err, results) {
    if (err) throw err;
  inquirer
    .prompt([{
      name: "employee",
      type: "choice",
      choices: results.map(employee=>
         {return {name: employee.first_name+" "+employee.last_name, value: employee.id} })
    },
    {
      name: "manager",
      type: "input",
      messager:"Input new manager ID"
    }

  ])
      .then(function(answer) {


          connection.query(
            "UPDATE employees SET ? WHERE ?",
            [
              {
                manager: answer.manager
              },
              {
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

// // function to add a new employee
// function addEmployee() {
//   connection.query("SELECT * FROM employees", function(err, results) {
//     if (err) throw err;
//   // prompt for info about the item being put up for auction
//   inquirer
//     .prompt([
//       {
//         name: "first_name",
//         type: "input",
//         message: "What is the employee's first name?"
//       },
//       {
//         name: "last_name",
//         type: "input",
//         message: "What is the employee's last name?"
//       },
//       {
//         name: "title",
//         type: "rawlist",
//         choices: function() {
//           var titleArray = [];
//           for (var i = 0; i < results.length; i++) {
//             choiceArray.push(results[i].title);
//           }
//           return titleArray;
//         },
//         message: "What is the employee's role?"
//       },
//       {
//         name: "department",
//         type: "rawlist",
//         choices: function() {
//           var departmentArray = [];
//           for (var i = 0; i < results.length; i++) {
//             choiceArray.push(results[i].department);
//           }
//           return departmentArray;
//         },
//         message: "What department is the employee in?"
//       },     
//       {
//         name: "salary",
//         type: "input",
//         message: "What is the employee's salary?"
//       },
//       {
//         name: "manager",
//         type: "rawlist",
//         choices: function() {
//           var managerArray = [];
//           for (var i = 0; i < results.length; i++) {
//             choiceArray.push(results[i].manager);
//           }
//           return managerArray;
//         },
//         message: "Who is the employee's manager?"
//       }      
//     ])
//     .then(function(answer) {
//       // when finished prompting, insert a new item into the db with that info
//       connection.query(
//         "INSERT INTO employees SET ?",
//         {
//           first_name: answer.first_name,
//           last_name: answer.last_name,
//           title: answer.title,
//           department: answer.department,
//           salary: answer.salary,
//           manager: answer.manager,
          
//         },
//         function(err) {
//           if (err) throw err;
//           console.log("New Empoyee Added!");
//           start();
//         }
//       );
//     });
//   })
//   start();
// }


