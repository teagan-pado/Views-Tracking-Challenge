export interface Recording {
    id: string; // matches document id in firestore
    creatorId: string; // id of the user that created this recording
    uniqueViewCount: number;
}

export interface User {
    id: string; // mathes both the user's document id
    uniqueRecordingViewCount: number; // sum of all recording views
    recordingsViewed: string[]; // array of all recordings viewed 
}

export enum Collections {
    Users = "Users",
    Recordings = "Recordings"
}