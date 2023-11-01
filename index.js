#!/usr/bin/env node

const fs = require("fs-extra");
const fsPromises = require("fs").promises;
const path = require("path");
const minimist = require("minimist");
const prompts = require("prompts");

const templates = {
	react: "template-reactjs",
	"react+redux empty": "template-reactjs_redux",
	"react+redux counter": "template-reactjs_redux-counter",
};

const argv = minimist(process.argv.slice(2));

function showNextSteps(projectPath, pkgManager = "npm") {
	const cwd = process.cwd(); // Current working directory
	const root = projectPath;

	const cdProjectName = path.relative(cwd, root);

	console.log("\nDone. Now run:\n");

	// Check if we need to cd into the project root
	if (root !== cwd) {
		console.log(
			`  cd ${
				cdProjectName.includes(" ") ? `"${cdProjectName}"` : cdProjectName
			}`
		);
	}

	// Display next steps based on package manager
	switch (pkgManager) {
		case "npm":
			console.log("  npm install");
			console.log("  npm run dev");
			break;
	}

	console.log();
}

async function createProject(template, projectName) {
	const commonTemplatePath = path.join(__dirname, templates["react"]);
	const specificTemplatePath = path.join(__dirname, templates[template]);
	const projectPath = path.join(process.cwd(), projectName);

	try {
		// Copy common React template files
		await fs.copy(commonTemplatePath, projectPath, {
			filter: (src) => {
				return !src.includes("node_modules");
			},
		});

		// If the template is not the basic react one, copy its specific files
		if (template !== "react") {
			await fs.copy(specificTemplatePath, projectPath, {
				filter: (src) => {
					return !src.includes("node_modules");
				},
			});
		}

		updatePackageName(projectPath, projectName);

		console.log(`Project created at ${projectPath}`);
		showNextSteps(projectPath);
	} catch (err) {
		console.error(err);
	}
}

async function updatePackageName(projectPath, projectName) {
	const packageJsonPath = path.join(projectPath, "package.json");

	// Read package.json
	const packageData = await fsPromises.readFile(packageJsonPath, "utf8");
	const packageJson = JSON.parse(packageData);

	// Modify the name
	packageJson.name = projectName;

	// Write the updated data back to package.json
	await fsPromises.writeFile(
		packageJsonPath,
		JSON.stringify(packageJson, null, 2),
		"utf8"
	);
}

function init() {
	const questions = [];

	if (!argv.n) {
		questions.push({
			type: "text",
			name: "projectName",
			message: "Enter project name",
		});
	}

	if (!argv.t) {
		questions.push({
			type: "select",
			name: "template",
			message: "Select a template",
			choices: Object.keys(templates).map((t) => ({ title: t, value: t })),
		});
	}

	if (questions.length > 0) {
		prompts(questions).then((answers) => {
			createProject(argv.t || answers.template, argv.n || answers.projectName);
		});
	} else {
		createProject(argv.t, argv.n);
	}
}
init();
