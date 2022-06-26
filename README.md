# Cards Game

## About the project

<p>
    This a RESTful API built-in with 
    <a href="https://adonisjs.com/" target="_blank">AdonisJs</a> v5.8.0 in TypeScript environment. This is an API of a Cards Game. This project was developed as a homework assignment  for a job opportunity. There is also a front-end that consumes this API. The front-end is avaliable on: <a href="https://github.com/FlavioLucasFer/cards-game-front" target="_blank">https://github.com/FlavioLucasFer/cards-game-front</a>
</p>

# Running the app

### prerequisites

    - NodeJs LTS
    - NPM package manager LTS


## Installing the dependencies


You need the *yarn* package manager to run the projects commands, so, to install *yarn* type on the root of the project:

    npm i yarn

If you want to install *yarn* globally, then type:

    npm i yarn -g

If you already have *yarn* installed, go ahead.

Now, to install the dependencies, type:

    yarn i 

if some problem occurs with *yarn i* try *npm i* instead.

<small>
    <b>note</b>: if you don't want to install *yarn* anyway, you can trade most of the command by the refferent *node ace* command. You can read about the *node ace* commands on the docs of AdonisJs or just copy them from *package.json*.
</small>

## Env file

Note that the project have a file named *.env.examples*. To configure your environment settings you need to copy and rename this file to *.env* (or just rename). 

Note that the file already have values to environment variables and it is quite possible that this values match to your environment. If this is the case, you will just need to copy *.env.example* and rename it (or just rename).

## Running the server

Now that your environment have been configured, you'll be able to run the app. To run the app, just type in the root of the project:

    yarn dev

## Before enjoy

Before start to reach the endpoints, you first need to run the migrations to create the database schema. Don't worry about database configs or environment, this API is using SQLite, so you don't need to worry about thousands of configurations and headache. 

The only thing you need to do is migrate the database. To do that, just type in the root of the project:

    yarn migrate

Now... ENJOY!

## SQLITE_CANTOPEN: unable to open database file

If this error occurs to you, create at the root of the project a folder named *tmp*. AdonisJs needs this folder to create the database as a temporary file. If this problem not have been occurred, just go ahead.

## Other usefull commands

### Run Tests

Runs the automated tests

    yarn test

### Rollback the migrations

    yarn rollback

### Fresh the database

Delete all database tables and runs the migrations from the beggining

    yarn fresh

# Where to find the real source code?

*AdonisJs* creates a lot of files and directories to it own configuration, that makes the projet fully and difficult to track the real source code of the application.

The *app* dir constains most part of the real implementation, so, everything in the subdirectories of *app* directory was write by me (except the Exceptions/Handler.ts, what a joke, right? except... Exceptions... sorry) 

Some peace of code is placed outside the *app* dir. These is the case of the migrations, seeders, tests and routes. All of these were wrote by me too. You can find these codes in the following paths:

    tests => tests/functional/*
    migrations => database/migrations/*
    routes => start/routes.ts

# Features

## Postman Collection and Environment

There is an exported postman collection (*cards_game.postman_collection.json*) with all the endpoints properly separed by folders and with an environment (*cards_game.postman_environment.json*) set for dev. Both of files can be find at the root os the project.

## Endpoints

Follows, there are all the API endpoints (routes) that represent features.

<b> Create and delete a game </b>

    [POST]   http://localhost:3333/api/v1/games
    [DELETE] http://localhost:3333/api/v1/games/:game_uuid

<b> Create a deck </b>

    [POST]   http://localhost:3333/api/v1/decks

<b> Add a deck to the game deck </b>

    [POST]   http://localhost:3333/api/v1/games/:game_uuid/decks
    body: { deck_id: number }

<b> Get, add and remove players from a game </b>

    [GET] http://localhost:3333/api/v1/games/:game_uuid/players
    [POST] http://localhost:3333/api/v1/games/:game_uuid/players
    body: { nickname: string }
    [DELETE] http://localhost:3333/api/v1/games/:game_uuid/players/:player_id

<b> Deal cards to a player in a game from the game deck </b>

    [POST] http://localhost:3333/api/v1/games/:game_uuid/deal-cards
    body: { player_id: number, (opt) quantity: number }

<b> Get the list of cards for a player </b>

    [GET] http://localhost:3333/api/v1/players/:player_id/cards

<b> Get the count of how many cards per suit are left undealt in the game deck </b>

    [GET] http://localhost:3333/api/v1/games/:game_uuid/undealt-suits

<b> Get the count of each card remaining in the game deck sorted by suit (
hearts, spades, clubs, and diamonds) and face value from high value to low value </b>

    [GET] http://localhost:3333/api/v1/games/:game_uuid/undealt-cards

<b> Shuffle the game deck (shoe) </b>

    [POST] http://localhost:3333/api/v1/games/:game_uuid/shuffle

# Know limitations

 - Local storage database
 - Lack of concurrency control
 - Only integration tests
 - Missing tests to some endpoints
 - Bad implementation of error reports and exception handling
