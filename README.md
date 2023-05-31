# kilt-didcomm-chatapp

## Setup Guide

## Prerequisites

Before you begin the installation, make sure you have the following prerequisites:

-   Node.js and Yarn installed on your system. You can download them from [Node.js](https://nodejs.org) and [Yarn](https://yarnpkg.com).

-   Nodemon. You can download it from [Nodemon]("https://www.npmjs.com/package/nodemon")(Download it globally)

## Step 1: Clone

```shell
git clone git@github.com:pokhrelanmol/kilt-didcomm-chatapp.git
```

## Step 2: Install dependencies and run individual server

client

```shell
cd client
yarn install
yarn run dev
```

backend

```shell
cd backend
yarn install
yarn run start
```

for the backend you are gonna need a mongodb uri. So create .env file inside the backend folder and paste the following text

```shell
MONGODB_URL=mongodb+srv://anmolpokhrel:7tpNYMJcS8OfkcG6@chat-app.wdext71.mongodb.net/
```

socket

```shell
cd socket
yarn install
yarn run start
```

### Everytime you login into the app the console.log will happen in the socket server.If in any case the server crashes just type `rs` to restart server or kill and restart it again using `yarn run  start`.

## Login with default accounts

There are already an accounts that are registed into the backend if you want you can just use this to login

## Make sure the Socket and backend server are running before performing this step

Open two browser tabs and login with the following account.

## Account 1

```text
  Mnemonic: "club luxury collect satoshi awake clinic table tunnel elevator gentle trade easy"
  DID: "did:kilt:4qNLDkBxZDaM5U2jKkHro4xkQsyhnXFWMvQJ71WzAfDM51WU"
```

## Account 2

```text
Mnemonic: "option coconut maximum guitar kiss grass minute six melt youth cross ten"
DID: "did:kilt:4sBCQNWZAL9UkzEzSq56NFPecEzRysjsdAqigY1cPQbuK1W1"
```

## Start chat

Once the both parties are loggedIn and webRTC peers are connected you can do this step.This happens automatically if you follow the above steps.

-   Click on the did uri under tha Chats section(from browser tab 1)
-   Click on the did uri under tha Chats section(from browser tab 2)
-   Webrtc connection will happen if all things are done properly
-   Enjoy realtime secure chatting with the peer.
