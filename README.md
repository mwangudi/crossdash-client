# CrossDash

## Claims Web client

Allows us to access the Claims system.
Our initial MVP will focus on Motor Claims.

## Setup

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). The project is also configured to run in Docker containers facilitated by `docker-compose`. [nib](https://github.com/technekes/nib) is our tool of choice for interacting with `docker-compose` in development.

## Modules

The project is built on a modular basis. Any Entity that has CRUD(BREAD) operations is identified as an individual module. As such, each module comprises of its own components, CSS, and store. The modular store actions, reducers and state are then exported to the app store to provide a `single source of truth` and hence global access. This means that any component that subscribes to the store will gain access to all actions and reduces regardless of the module in which actions are defined in.

## Secrets

The app requires several "secrets" in order to run integration tests in development. These secrets must exist in the .env file.

## Development

Run the following commands to get started with app development

```
nib build
nib setup web
nib up web
```

Visit [http://localhost:3000/](http://localhost:3000/) to view the site.
