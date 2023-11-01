#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");
const minimist = require("minimist");
const prompts = require("prompts");

const templates = {
	react: "template-reactjs",
	"react+redux": "template-reactjs_redux",
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
	const templatePath = path.join(__dirname, templates[template]);
	const projectPath = path.join(process.cwd(), projectName);

	try {
		await fs.copy(templatePath, projectPath);
		console.log(`Project created at ${projectPath}`);

		showNextSteps(projectPath);
	} catch (err) {
		console.error(err);
	}
}

function init() {
	const questions = [];

	if (!argv.t) {
		questions.push({
			type: "select",
			name: "template",
			message: "Select a template",
			choices: Object.keys(templates).map((t) => ({ title: t, value: t })),
		});
	}

	if (!argv.n) {
		questions.push({
			type: "text",
			name: "projectName",
			message: "Enter project name",
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
