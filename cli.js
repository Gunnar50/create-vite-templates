#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");

// Get the name of the new project folder from the command line arguments
const projectFolder = process.argv[2] || "my-new-project";

// Paths for the template folder and the new project folder
const templatePath = path.join(__dirname, "template");
const projectPath = path.join(process.cwd(), projectFolder);

// Function to copy the template into a new project directory
async function createProject() {
	try {
		await fs.copy(templatePath, projectPath);
		console.log(`Project created at ${projectPath}`);
	} catch (err) {
		console.error(err);
	}
}

// Run the function
createProject();
