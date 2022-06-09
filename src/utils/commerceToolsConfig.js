export const {
    ClientBuilder,
    createAuthForClientCredentialsFlow,
    createHttpClient,
} = require('@commercetools/sdk-client-v2')
export const { createApiBuilderFromCtpClient } = require('@commercetools/platform-sdk')
export const fetch = require('node-fetch')

export const projectKey = 'octobook'
export const authMiddlewareOptions = {
    host: `${process.env.HOST}`,
    projectKey,
    credentials: {
        clientId: `${process.env.CLIENT_ID}`,
        clientSecret: `${process.env.CLIENT_SECRET}`,
    },
    oauthUri: '/oauth/token', // - optional: custom oauthUri
    scopes: [`manage_project:${projectKey}`],
    fetch,
}

export const httpMiddlewareOptions = {
    host: `${process.env.HTTP_HOST}`,
    fetch,
}

export const client = new ClientBuilder()
    .withProjectKey(projectKey)
    .withMiddleware(createAuthForClientCredentialsFlow(authMiddlewareOptions))
    .withMiddleware(createHttpClient(httpMiddlewareOptions))
    .withUserAgentMiddleware()
    .build()

export const apiRoot = createApiBuilderFromCtpClient(client)
