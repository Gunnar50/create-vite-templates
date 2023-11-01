#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");
const minimist = require("minimist");
const prompts = require("prompts");

const argv = minimist(process.argv.slice(2));

// Templates available
const templates = {
	react: "template-reactjs",
	"react+redux": "template-reactjs_redux",
};

async function createProject(template, projectName) {
	const templatePath = path.join(__dirname, templates[template]);
	const projectPath = path.join(process.cwd(), projectName);

	try {
		await fs.copy(templatePath, projectPath);
		console.log(`Project created at ${projectPath}`);
	} catch (err) {
		console.error(err);
	}
}

async function init() {
	let projectName = argv.n || "my-new-project";
	let template = argv.t || null;

	if (!template) {
		const response = await prompts({
			type: "select",
			name: "template",
			message: "Pick a template",
			choices: Object.keys(templates).map((t, i) => ({ title: t, value: t })),
		});

		template = response.template;
	}

	if (!projectName) {
		const response = await prompts({
			type: "text",
			name: "name",
			message: "Project name",
			initial: "my-new-project",
		});

		projectName = response.name;
	}

	if (!templates[template]) {
		console.error("Template not found");
		process.exit(1);
	}

	createProject(template, projectName);
}

init();
