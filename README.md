# Views-Tracking-Challenge

### Prerequisites:
- Node, if you don't have it, you can install it from https://nodejs.org/en/download/

### Getting Started:
- install the firebase CLI with
```
npm install -g firebase-tools
```
- navigate to the functions directory and install dependencies with
```
cd functions && npm i
```

### Writing Your Code:
The main place you'll want to write your code is inside. 

### Running Your Code:
Firebase has some excellent tooling for locally emulating cloud functions, firestore database, and more in concert. We've set up database with some dummy data for you to play around with, and a website you can use to easily hit your locally running cloud function. Here's how to use it
- initiate the emulator from the functions directory with
```
npm run serve
```
- once your emulator is running, you can can easily access the firestore database and your function logs through the firebase emulator ui at http://localhost:4000. You should see some dummy data in the database when on startup
- use https://sirocodingchallenges.web.app to easily make requests to your function running locally
- NOTE: we don't have hot reloading setup for this project yet, so you'll have to terminate the emulator and restart with 
```
npm run serve
```
whenever you make code changes