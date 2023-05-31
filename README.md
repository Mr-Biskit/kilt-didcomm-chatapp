# Decentralized Identity (DID) Messaging Application

## Table of Contents

-   [Introduction](#introduction)
-   [Setup](#setup)
-   [Encryption and Decryption](#encryption-and-decryption)
    -   [Secret Derivation](#secret-derivation)
    -   [Encryption](#encryption)
    -   [Decryption](#decryption)
-   [Message Signing and Verification](#message-signing-and-verification)
    -   [Message Signing](#message-signing)
    -   [Message Verification](#message-verification)
-   [Conclusion](#conclusion)

## Introduction

Welcome to our Decentralized Identity (DID) Messaging Application! This chat application leverages the KILT DID key agreement pair for encryption and decryption, as well as the user's authentication key to sign messages. This provides confidence to the receiver in verifying the sender's identity.

For safety and security, it is essential that a user's mnemonic is never shared with other parties. Therefore, for the purposes of this test scenario, we have provided scripts to generate test mnemonics and DIDs. While the application does require the user's mnemonic of their DID to generate the keys necessary for message encryption, decryption, and signing, remember that this mnemonic should be kept confidential and is stored securely in the browser, not kept on the backend server.

## Setup

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

## Login with default pre made accounts

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

## This is the implementation that we tried to do using DIDComm spec [DIDComm Implementation]("https://github.com/Mr-Biskit/didComm-anonCrypt")

## Encryption and Decryption

Our chat application relies on several essential processes, primarily encryption, decryption, and the derivation of shared secrets. Here's an overview:

### Secret Derivation

We use the cryptography library TweetNaCl.js to generate a shared secret using the public and private keys of the two parties involved. This shared secret is derived from the encryption of an empty message using a nonce and keys, which produces a "box" that serves as the shared secret.

```javascript
import nacl from "tweetnacl";

export function deriveSharedSecret(privateKeyA, publicKeyB, nonce) {
    // ...
}
```

### Encryption

Our application utilizes the shared secret to generate an encryption key using HMAC-SHA256 and a nonce. The message to be encrypted is converted to a JSON string and encrypted using an AES-256-GCM cipher.

```javascript
import { randomBytes, createHmac, createCipheriv } from "crypto-browserify";

export function deriveKey(sharedSecret) {
    // ...
}

export function encryptMessage(message, sharedSecret, signature) {
    // ...
}
```

### Decryption

During decryption, we extract the initialization vector (IV), tag, and encrypted text from the received encrypted message. We then decrypt it using the AES-256-GCM decipher with the derived key and the IV.

```javascript
import { createDecipheriv } from "crypto-browserify";
import { deriveKey } from "./encryption";
export function decryptMessage(encrypted, sharedSecret) {
    // ...
}
```

## Message Signing and Verification

Our application uses KILT SDK to sign and verify messages, which greatly enhances security by validating the sender's identity.

### Message Signing

We sign messages using the DID's authentication key. The signing function accepts a callback that is used for signing the data, providing flexibility to customize the signing process according to different requirements.

```javascript
import * as Kilt from "@kiltprotocol/sdk-js";
import { getDidDoc } from "../kilt/didResolver";

export async function signMessage(message, signCallback, didUri) {
    // ...
}
```

### Message Verification

To ensure the authenticity of received messages, we use a verification function that checks the message's signature using the sender's public key. If the signature does not match, the function throws an error, indicating possible message tampering or incorrect sender identity.

```javascript
export async function verifyMessageSignature(message, signature) {
    // ...
}
```

## Conclusion

Although our application doesn't fully meet the DIDComm spec, it offers a strong foundation and substantial insight into encryption, decryption, and real-time communication. We'll continue to enhance the app
's decentralization and security, striving to realize the vision of a privacy-preserving, decentralized chat application.
