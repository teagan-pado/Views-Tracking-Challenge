import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {db} from "./index";

// Moved all of the defined types to a types.js file for future consumption 

export async function trackRecordingView(viewerId: string, recordingId: string): Promise<void> {

  // Get Both Collections
    const getUserRef = await db.collection("Users").doc(viewerId).get();
    const getRecordingRef = await db.collection("Recordings").doc(recordingId).get();

    try{
          // First check to make sure we are dealing with valid inputs
            if(getUserRef.exists && getRecordingRef.exists) {

              // We want to transactionally check and update the count for both collections/documents
              await db.runTransaction(async (t): Promise<void> => {
                // Get all recordings with the input recordingId => is unique
                const recordingRefSnap: admin.firestore.Query = db.collection("Recordings")
                    .where("id", "==", recordingId);

                // Get all users with the input viewerId => is unique
                const userRefSnap: admin.firestore.Query = db.collection("Users")
                    .where("id", "==", viewerId);
                
                // Get all Documents from the previous query where there is an array with 
                // the input recordingId
                const recordingRef: admin.firestore.QuerySnapshot = await t.get(userRefSnap
                    .where("recordingsViewed", "array-contains", recordingId));

                // When there are no recordings in our pair, continue
                if (recordingRef.size == 0){
                  functions.logger.debug("We do not have a record of this recording and this user")

                  // Transactionally update the collections within the overall promise so we dont 
                  // get multiple updates at the same time overlapping
                  await db.runTransaction(async (t): Promise<void> => {
                        // Update the User Document
                        await t.get(userRefSnap).then((snapshot) => {
                          snapshot.docs.forEach(doc => {
                            const resultSnapshot = doc.data().uniqueRecordingViewCount
                            const updateUserDocument = db.collection("Users").doc(viewerId)
                            updateUserDocument.update({ recordingsViewed: admin.firestore.FieldValue.arrayUnion(recordingId) })
                            updateUserDocument.update({uniqueRecordingViewCount: resultSnapshot + 1})
                          })
                        })
                        // Update the Record Document
                        await t.get(recordingRefSnap).then((snapshot) => {
                          snapshot.docs.forEach(doc => {
                            const resultSnapshot = doc.data().uniqueViewCount
                            const updateRecordingDocument = db.collection("Recordings").doc(recordingId)
                            updateRecordingDocument.update({uniqueViewCount: resultSnapshot + 1})
                          })
                        })

                      })

                } else {
                  // When !=0 we have a record of this unique viewer and recording
                  // Should likely have some sort of handling for NaN or undefined here as well that is more readable
                  functions.logger.debug("This user has already viewed this recording!")
                };
            
              });
            } else {
              // Could either try catch this or exit early gracefully here
              // I chose the latter b/c as a user I dont love seeing the hard error
              // thrown on the FE
              functions.logger.debug("ERROR: Bad Inputs")
            }
          } catch (e) {
            throw e;
          }
}
