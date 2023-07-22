#! /usr/bin/env node
import fetch from 'node-fetch';

const DEFAULT_REGISTRY_URL = 'https://egistry.hub.docker.com';

const GET_CATALOG = 'v2/_catalog';
const GET_IMAGES = 'v2/<name>/tags/list';

type ArgType = '-u' | '-r' | '-p' | '-s';

async function dockerService(
	registryUrl: string | null,
	userName: string | null,
	password: string | null,
	serviceName: string | null
) {
	if (!userName) {
		console.error('username is missing, Kindly visit -h for help');
		return;
	}
	if (!password) {
		console.error('password is missing, Kindly visit -h for help');
		return;
	}
	try {
		const authHeader = `Basic ${Buffer.from(`${userName}:${password}`).toString('base64')}`;
		const result = await (
			await fetch(
				`${registryUrl ? `https://${registryUrl}` : DEFAULT_REGISTRY_URL}/${
					serviceName || GET_CATALOG
				}`,
				{
					method: 'GET',
					headers: {
						Authorization: authHeader.trim()
					}
				}
			)
		).json();
		console.info(result);
	} catch (e) {
		console.error('Error in DS', e);
	}
}

function fetchArg(argType: ArgType, args: Array<string>): Array<string> {
	return args.filter((arg) => arg.includes(argType));
}

(async function () {
	const [, , ...other] = process.argv;
	if (other.includes('-h')) {
		console.info(`
-u: used to pass the username eg: -u=temp
-p: used to pass the password eg: -p=password
-r: used to pass the registry url eg: -r=registry.com(default is registry.hub.docker.com)
-s: used to pass the api eg: -s:V2/_catalog(gets catalog), for this visit https://docs.docker.com/registry/spec/api/ for more details
		`);
	}

	const arr = ['-u:username', '-p:password', '-r:registry.com'];
	const userNameArg = fetchArg('-u', other);
	const userName = userNameArg.length > 0 ? userNameArg[0].split(':')[1] : null;
	const passwordArg = fetchArg('-p', other);
	const password = passwordArg.length > 0 ? passwordArg[0].split(':')[1] : null;
	const registryArg = fetchArg('-r', other);
	const registry = registryArg.length > 0 ? registryArg[0].split(':')[1] : null;
	const serviceArg = fetchArg('-s', other);
	const service = serviceArg.length > 0 ? serviceArg[0].split(':')[1] : null;

	await dockerService(registry, userName, password, service);
})();
