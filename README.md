# NextJS - Auth0 - Hasura

This repo sits on the shoulders of the following giants:

- https://github.com/auth0/nextjs-auth0
- https://github.com/sandrinodimattia/nextjs-auth0-example
- https://github.com/zeit/next.js/tree/canary/examples/auth0

## Features

- ⚡️ compatible with Next.js 9's Automatic Static Optimization
- 🚫 no custom server code

## Demo

Try it [here](https://nextjs-auth0-hasura.vgrafe.now.sh/)

Please note: the heroku instance might be inactive when you try logging in, resulting in a failed attempt. Try again and it will work. Damn cold starts!

One way I found to avoid this is to make a dummy http call to the heroku instance in an `_app.js` file:

```js
import App from 'next/app';
import fetch from 'isomorphic-unfetch';

fetch(process.env.HASURA_GRAPHQL_URL); // wake up that darn instance!

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return <Component {...pageProps} />;
  }
}

export default MyApp;
```

## Shortcomings - Help needed!

- The profile page won't display user data initially. I am shrugging this one off as my goal here is to demonstrate consuming Hasura's gql endpoint and only rely on auth0's idToken to do so.
- I can't find out how to seamlessly pass the token via cookies as suggested from [Apollo's](https://github.com/apollographql/apollo-client/issues/4455) [documentation](https://github.com/apollographql/apollo-client/issues/4190) and [issues](https://github.com/apollographql/apollo-client/issues/41900). The current workaround is to set cookie manually after auth, but it's ugly and feels unnecessary when if should be provided out of the box by Apollo.
- the idToken is set/get in a cookie with `js-cookie` in order to add to the headers for calls to hasura (look for all the "TODO remove when cookie solution found" comments). It should be handled out of the box by `nextjs-auth0`, so this might be a mistake/overlook of mine.
- login is janky when using a social button. I don't have much time to troubleshoot this either.
- a proxi api route should be used to avoid exposing the id token in the client, as explained [here](https://github.com/auth0/nextjs-auth0/issues/67#issuecomment-581599845)

## Setup

Begin by cloning this repository

### Auth0 Setup

1. Create or log into your Auth0 account.
1. Create a new regular web application.
1. Copy your local repository `.env.example` file to `.env` and enter the Domain, Client ID, and Client Secret from your new Auth0 application's settings page.
1. Add rules found in `auth0` folder (!Important! `upsert-user.js` should be listed before `hasura-jwt-claim.js` in Auth0 so that the rules are executed in the correct order, especially for first time logins).

### Hasura Setup

1. Click to deploy GraphQL Engine on Heroku with the free Postgres add-on:
   [![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/hasura/graphql-engine-heroku)
1. [Generate JWT secret](https://hasura.io/jwt-config/) and add it to Config Vars under Heroku settings using the variable name `HASURA_GRAPHQL_JWT_SECRET`.
1. Pick a value for `HASURA_GRAPHQL_ADMIN_SECRET` and add the variable to Heroku's Config Vars.
1. (Optional) add the `HASURA_GRAPHQL_UNAUTHORIZED_ROLE` var.
1. Fill in local `hasura/config.yaml` file with:
   - admin_secret: `HASURA_GRAPHQL_ADMIN_SECRET` value from Heroku
   - endpoint: https://<yourappname>.herokuapp.com/
1. Populate the hasura database:

```bash
 cd hasura
 hasura migrate apply
```

### Finish Auth0 Setup

1. Add values to the "global configuration object". Accessible through your Auth0 dashboard in the settings subheader under the Rules page.
   - `HASURA_GRAPHQL_ADMIN_SECRET` (copy value from HASURA_GRAPHQL_ADMIN_SECRET in heroku)
   - `HASURA_GRAPHQL_URL` (eg https://<yourappname>.herokuapp.com/v1/graphql)
1. Fill out the callback and redirect URLs for your Auth0 app under Applications > (your application) > Settings.

### Install Dependencies

```bash
 yarn install
 yarn dev
```

## Deploy with Vercel now

- Update `REDIRECT_URI` and `POST_LOGOUT_REDIRECT_URI` in the `now.json` file
- add all the secrets (start with @ in the file) [with the cli](https://zeit.co/docs/v2/build-step/#using-environment-variables-and-secrets)

## Notes

- [How to](https://dev.to/mikewheaton/public-graphql-queries-with-hasura-2n06) set up public access on hasura.
