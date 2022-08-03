import { writeFile } from 'fs';

const targetPath = './src/environments/environment.prod.ts';

const envConfigFile = `export const environment = {
    firebase: {
      projectId: 'klaiarmon-management',
      appId: '${process.env['FIREBASE_APP_ID']}',
      databaseURL: 'https://klaiarmon-management-default-rtdb.asia-southeast1.firebasedatabase.app',
      storageBucket: 'klaiarmon-management.appspot.com',
      apiKey: '${process.env['FIREBASE_API_KEY']}',
      authDomain: 'klaiarmon-management.firebaseapp.com',
      messagingSenderId: '870991689767',
      measurementId: 'G-L4BC23E9QC',
      firestoreHolidaySecret: '${process.env['FIRESTORE_HOLIDAY_SECRET']}'
    },
    production: true
  };`;

writeFile(targetPath, envConfigFile, 'utf8', (err) => {
    if (err) console.error(err);
});
