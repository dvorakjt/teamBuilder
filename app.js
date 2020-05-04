const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const employees = [];

let filename = '';

const init = () => {
    inquirer.prompt({
        type: "input",
        message: "Please enter your team name!",
        name: "teamName"
    }).then(answers => {
        filename = answers.teamName;
        console.log('');
        addManager();
    });
}

const addManager = () => {
    inquirer.prompt([
        {
            type: "input",
            message: "Please enter the project manager's name.",
            name: "name"
        },
        {
            type: "input",
            message: "Please enter the manager's id #.",
            name: "id"
        },
        {
            type: "input",
            message: "Please enter the manager's email address.",
            name: "email"
        },
        {
            type: "input",
            message: "Please enter the manager's office number.",
            name: "officeNumber"
        }
    ]).then(answers => {
        const [{ name }, { id }, { email }, { officeNumber }] = Array(4).fill(answers);
        const manager = new Manager(name, id, email, officeNumber);
        employees.push(manager);
        console.log("");
        console.log(`Manager ${name} has been added to the team!`);
        console.log("");
        addMoreEmps();
    });
}

const addMoreEmps = () => {
    inquirer.prompt({
        type: "confirm",
        message: "Would you like to add another employee?",
        name: "addMore"
    }).then(answers => {
        const { addMore } = answers;
        if (addMore) addEmp();
        else {
            const html = render(employees);
            fs.writeFile(`./output/${filename}.html`, html, (err) => {
                if (err) throw err
                else console.log("Your file has been saved!");
            })
        }
    })
}

const addEng = (name, id, email) => {
    inquirer.prompt({
        type: "input",
        message: "Please enter the engineer's github username.",
        name: "github"
    }).then(answers => {
        const { github } = answers;
        const engineer = new Engineer(name, id, email, github);
        employees.push(engineer);
        console.log("");
        console.log(`Engineer ${name} has been added to the team!`);
        console.log("");
        addMoreEmps();
    });
};

const addInt = (name, id, email) => {
    inquirer.prompt({
        type: "input",
        message: "Please enter the intern's school.",
        name: "school"
    }).then(answers => {
        const { school } = answers;
        const intern = new Intern(name, id, email, school);
        employees.push(intern);
        console.log("");
        console.log(`Intern ${name} has been added to the team!`);
        console.log("");
        addMoreEmps();
    });
};

const addEmp = () => {
    inquirer.prompt([
        {
            type: "list",
            message: "What type of employee would you like to add?",
            choices: ["Engineer", "Intern"],
            name: "role"
        },
        {
            type: "input",
            message: "Please enter the employee's name.",
            name: "name"
        },
        {
            type: "input",
            message: "Please enter the employee's id #.",
            name: "id"
        },
        {
            type: "input",
            message: "Please enter the employee's email address.",
            name: "email"
        }
    ]).then(answers => {
        const [{ role }, { name }, { id }, { email }] = Array(4).fill(answers);
        if (role === "Engineer") addEng(name, id, email);
        else addInt(name, id, email);
    });
}

init();