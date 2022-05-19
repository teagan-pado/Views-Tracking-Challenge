import * as functions from "firebase-functions";
import {trackRecordingView} from "./track-recording-view";

import * as admin from "firebase-admin";
// eslint-disable-next-line max-len
import * as serviceAccount from "../sirocodingchallenges-firebase-adminsdk-d5epk-d5345de48d.json";
import {ServiceAccount} from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
  projectId: "sirocodingchallenges",
});

// use db to access the database
export const db = admin.firestore();


// If you need, here's the documentation for google cloud functions w typescript:
// https://firebase.google.com/docs/functions/typescript

// assumes the request has been authenticated, the caller has the required permissions
export const recordingViews = functions.https.onRequest(async (request, response) => {
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "POST");
  response.set("Access-Control-Allow-Headers", "Content-Type");
  if (request.method === "POST") {
    try {
      const {viewerId, recordingId} = request.body;
      
      // I wanted to validated on the type of the input, but if youre going through
      // the FE it makes everything a string
      // If we are using a different way to interact with the app we might want to add 
      // other error handling i.e types, regex against special characters, etc

      if (!viewerId.length || !recordingId.length) {
        // Log for the console to debug
          functions.logger.error("Please provide both inputs!");
          response.status(400).send("Please provide both inputs!");
          return;
      }

      // Warning this does not validate against space as an input

      await trackRecordingView(viewerId, recordingId);
      // it worked!
      response.status(200).send("No errors!");
    } catch (e) {
      // it didn't work :/
      functions.logger.error(e);
      response.status(500).send("We messed up :(");
    }
  } else if (request.method === "OPTIONS") {
    response.status(204).send("Go ahead");
  } else {
    functions.logger.debug("request wasn't a POST or OPTIONS");
    response.status(400).send("only OPTIONS or POST requests are allowed");
  }
});
