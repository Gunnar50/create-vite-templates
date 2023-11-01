#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

// Templates available
const templates = {
	react: "template-reactjs",
	"react+redux": "template-reactjs_redux",
};

// Function to create the project
async function createProject(template) {
	const templatePath = path.join(__dirname, templates[template]);
	const projectName = "my-new-project"; // You can make this dynamic
	const projectPath = path.join(process.cwd(), projectName);

	try {
		await fs.copy(templatePath, projectPath);
		console.log(`Project created at ${projectPath}`);
	} catch (err) {
		console.error(err);
	}
}

// If a template name is provided directly
if (process.argv[2]) {
	const template = process.argv[2];
	if (!templates[template]) {
		console.error("Template not found");
		process.exit(1);
	}
	createProject(template);
} else {
	// Otherwise, show the user the available templates
	console.log("Please choose a template:");
	const templateNames = Object.keys(templates);
	templateNames.forEach((name, index) => {
		console.log(`${index + 1}. ${name}`);
	});

	rl.question("Your choice: ", (answer) => {
		const index = parseInt(answer) - 1;
		if (isNaN(index) || index < 0 || index >= templateNames.length) {
			console.error("Invalid choice");
			rl.close();
			process.exit(1);
		}

		createProject(templateNames[index]);
		rl.close();
	});
}
