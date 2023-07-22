#! /usr/bin/env node

const DEFAULT_REGISTRY_URL = 'https://dockerhub.com';
const GET_CATALOG = 'v2/_catalog';

type ArgType = '-u' | '-s' | '-p' | '-r';

async function dockerService(
    registryUrl: string | null,
    userName: string | null,
    password: string | null,
    serviceName: string | null
) {
    if(!userName)
}
