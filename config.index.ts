import { writeFile } from 'fs';

const targetPath = './src/environments/environment.prod.ts';

const envConfigFile = `export const environment = {
    firebase: {
      projectId: 'klaiarmon-management',
      appId: '1:870991689767:web:0f067378159faa86177602',
      databaseURL: 'https://klaiarmon-management-default-rtdb.asia-southeast1.firebasedatabase.app',
      storageBucket: 'klaiarmon-management.appspot.com',
      apiKey: '${process.env['FIREBASE_API_KEY']}',
      authDomain: 'klaiarmon-management.firebaseapp.com',
      messagingSenderId: '870991689767',
      measurementId: 'G-L4BC23E9QC',
    },
    production: true
  };`;

writeFile(targetPath, envConfigFile, 'utf8', (err) => {
    if (err) console.error(err);
});
