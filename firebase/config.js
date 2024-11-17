import * as FileSystem from 'expo-file-system';
import SQLite from 'react-native-sqlite-storage';

const dbFileName = 'pigEx.db';
const dbPath = `${FileSystem.documentDirectory}${dbFileName}`;

// Function to create a new SQLite database and ensure the "contacts" table exists
const initializeDatabase = async () => {
  const dbFileInfo = await FileSystem.getInfoAsync(dbPath);

  if (!dbFileInfo.exists) {
    console.log('Database file does not exist. Creating a new one...');

    // Open the database file (creates it if it doesn't exist)
    const db = SQLite.openDatabase(dbFileName);

    // Create the "contacts" table
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS contacts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          address TEXT NOT NULL,
          contactNumber TEXT NOT NULL
        );`,
        [],
        () => console.log('Contacts table created successfully.'),
        (_, error) => console.error('Error creating contacts table:', error)
      );
    });

    console.log(`Database created successfully at: ${dbPath}`);
  } else {
    console.log('Database already exists at:', dbPath);
  }

  // Return the database object after ensuring it's initialized
  return SQLite.openDatabase(dbFileName);
};

// Initialize the database
initializeDatabase().then(db => {
  // You can now use the db object after initialization
  console.log('Database is ready to use');
}).catch(error => {
  console.error('Error initializing database:', error);
});