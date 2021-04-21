const core = require('@actions/core');
const https = require('https');

async function run() {
	const jobStatus = core.getInput('job-status');
	const slackChannel = core.getInput('slack-channel');

	let color = '#808080'
	if (jobStatus === 'success') {
		color = 'good';
	} else if (jobStatus === 'failure') {
		color = 'danger';
	}

	// Available environment variables:
	// https://docs.github.com/en/actions/reference/environment-variables#default-environment-variables
	const message = `Job ${process.env.GITHUB_JOB} of ${process.env.GITHUB_REPOSITORY} (${process.env.GITHUB_REF}): ${jobStatus}`;
	const payload = {
		'channel': slackChannel,
		'attachments': [{'text': message, 'color': color}]
	};
	await send(payload);
}

async function send(payload) {
	// This is based on https://github.com/Brymastr/slack-action/blob/c7685b5d7a96e613129d3cede7c1c01fbc776e1a/index.js#L51-L84
	const slackBotToken = core.getInput('slack-bot-token');
	const options = {
		hostname: 'slack.com',
		port: 443,
		method: 'POST',
		path: '/api/chat.postMessage',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${slackBotToken}`,
		},
	};

	return new Promise((resolve, reject) => {
		const req = https.request(options, res => {
			if (res.statusCode < 200 || res.statusCode >= 300) {
				return reject(new Error(`Status Code: ${res.statusCode}`));
			}

			const data = [];
			res.on('data', chunk => { data.push(chunk) });
			res.on('end', () => resolve(Buffer.concat(data).toString()));
		});

		req.on('error', reject);
		req.write(JSON.stringify(payload));
		req.end();
	});
}

try {
	run();
} catch (error) {
	core.setFailed(error.message);
}
