# Veramo 
## About 
Veramo was written in TypeScript so it runs natively in Node, Browsers and React Native.. The Veramo DID Agent is the entry point into the Veramo framework. A Veramo Agent is an implementation of an Agent using a plugin architecture. This architecture allows Veramo to be modular, scale well and play nicely with the vast array of standards in the verifiable data space
# Development tools
## CLI Tool
The Veramo CLI exposes a configurable agent and includes an express server, open-api and swagger docs.
Run `npm i @veramo/cli -g` or run `yarn global add @veramo/cli` to install.<br>

To check the CLI has installed, run:
`veramo -v`
## Create configuration
Developers can use a per-project configuration or specify a configuration file with each command. If the current folder contains an `agent.yml` configuration file, for every command.

Alternatively, developers can specify a config file with each command using the `--config /path/to/your/config.yml` option. This will be used instead of a per-project configuration file.

Developers can create a configuration file in the current folder by running:<br>
`veramo config create`<br>

This will create an agent.yml file that will get used next time you invoke a CLI command in this folder. By default, the database files are created in the same folder as the config file.

Using configuration file:<br>
```
# From outside the directory
veramo did create --config ./myagent/agent.yml

# It will detect a local agent.yml file when run from within the myagent directory
veramo did create
```

## Veramo React
### Install and set up
`yarn add @veramo-community/veramo-react`<br>
Installation includes `@veramo/core@next` and `@veramo/remote-client@next`. You will NOT need to add additional `@veramo` dependencies to your app if you are just working with remote agents.

The following is a simplified extract from Veramo Agent Explorer that uses React Query on top of `Veramo React` to manage the data layer including caching and global data syncing.

```
import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { VeramoProvider } from '@veramo-community/veramo-react'
import { QueryClientProvider, QueryClient } from 'react-query'
import App from '../App'

const queryClient = new QueryClient()

export default = () => (
<QueryClientProvider client={queryClient}>
<VeramoProvider>
<BrowserRouter>
<Route component={App} />
</BrowserRouter>
</VeramoProvider>
</QueryClientProvider>
)
```

### Create local agent
Create an agent in your app and export it. You will need to install additional dependencies<br>
`yarn add @veramo/did-resolver@next ethr-did-resolver did-resolver web-did-resolver`

```
import { createAgent, IResolver } from '@veramo/core'
import { DIDResolverPlugin } from '@veramo/did-resolver'
import { Resolver } from 'did-resolver'
import { getResolver as ethrDidResolver } from 'ethr-did-resolver'
import { getResolver as webDidResolver } from 'web-did-resolver'

// You will need to get a project ID from infura https://www.infura.io
const INFURA_PROJECT_ID = '<your PROJECT_ID here>'

export const agent = createAgent<IResolver>({
plugins: [
new DIDResolverPlugin({
resolver: new Resolver({
...ethrDidResolver({ infuraProjectId: INFURA_PROJECT_ID }),
...webDidResolver(),
}),
}),
],
})
```
In the provider setup above, add the following to bootstrap the local agent.

#### Use Veramo hook
The primary hook that provides the following API to your app. The below syntax uses React Query to fetch the data and uses the cache key of `resolutionResult + agentID` to identify the data to your app.
```
import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery } from 'react-query'

export default = () => {
const { agent } = useVeramo<IResolver>()
const { data } = useQuery(
['resolutionResult', { agentId: agent?.context.id }],
() => agent?.resolveDid({ didUrl: 'did:web:community.veramo.io' })())

    return (
        <div>
            {
                data?.didDocument?.verificationMethod.map((key) => (
                    <div>{JSON.stringify(key)}</div>
                )
            }
        <div>
    )
}
```

### API
#### agent
The current active agent object. Call agent methods as normal:<br>
`
agent[METHOD]
`
<br>

`agents` : A list of all configured agents.<br>
`activeAgentId` : The ID of the currently active agent.<br>
`setActiveAgentId` : Set the current active agent by ID.<br>
`addAgent` : Add a local agent. Create a local agent as per example in `Create local agent` section.
```
import { agent } from '../veramo'
import { useVeramo } from '@veramo-community/veramo-react'

// Inside a function component

const { addAgent } = useVeramo()

const addLocalAgent = () => {
addAgent(agent)
}
```

`removeAgent` : Remove an agent by ID.<br>
`addAgentConfig`: Add a remote agent configuration.
```
import { useVeramo } from '@veramo-community/veramo-react'
// Inside a function component
const { addAgentConfig } = useVeramo()

const newAgentConfig = () => {
addAgentConfig({
context: { name: 'Agent Name', schema: schemaUrl },
remoteAgents: [
{
url: agentUrl,
enabledMethods: Object.keys(schema['x-methods']),
token: apiKey,
},
],
})
}
```
`updateAgentConfig` : Update the configuration of an agent.<br>
`getAgentConfig` :Get the current configuration for an agent.<br>
`getAgent` : Get an agent by ID.

## Agent Explorer
### Install
Run locally using `npx`<br>
```
npx agent-explore serve
```
Or use the public version https://explore.veramo.io

