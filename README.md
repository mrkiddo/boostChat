# boostChat
A real-time chat app

## Stacks
* Express
* MongoDB
* Vuejs (with browserify, hbsfy and scss)

## Features (first stage)
### Main
* User Authentication (create, login based on jsonWebToken RESTful style APIs)
* Real-time communication (based on socket.io)
### Others
* User Avatar
* Contact list management (stick to top)
* Contact online status indicator

## Version
current: v0.1.0

## Project Tasks
Pull files to local and run following commands
### Restore packages
    npm install
### Build bundle script file
    npm run buildjs
    npm run buildlogin
### Build bundle css file
    npm run scss
    npm run scsslogin
### Start server
    npm run start
