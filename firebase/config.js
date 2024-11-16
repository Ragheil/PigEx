import { collection, getDocs } from 'firebase/firestore';
import { auth, firestore } from '../firebase/config2'; // Adjust the path to your Firebase config
import SQLite from 'react-native-sqlite-storage';

// Open or create a database
let db = null;

const openDatabase = () => {
  db = SQLite.openDatabase(
    'contacts.db',
    () => {
      console.log('Database opened successfully');
      setupDatabase(); // Set up the database after opening
    },
    (error) => console.error('Error opening database:', error)
  );
};

// Initialize the database table
const setupDatabase = () => {
  if (!db) {
    console.error('Database is not initialized');
    return;
  }

  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS contacts (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        contactNumber TEXT NOT NULL
      );`,
      [],
      () => console.log('Table created or already exists'),
      (_, error) => console.error('Error creating table', error)
    );
  });
};

// Insert or update a contact locally
export const saveContactLocally = (contact) => {
  if (!db) {
    console.error('Database is not initialized');
    return;
  }

  if (!contact || !contact.id || !contact.name || !contact.address || !contact.contactNumber) {
    console.error('Invalid contact data:', contact);
    return;
  }

  db.transaction(tx => {
    tx.executeSql(
      `INSERT OR REPLACE INTO contacts (id, name, address, contactNumber) VALUES (?, ?, ?, ?);`,
      [contact.id, contact.name, contact.address, contact.contactNumber],
      () => console.log('Contact saved locally'),
      (_, error) => console.error('Error saving contact locally', error)
    );
  });
};

// Fetch local contacts
export const fetchLocalContacts = (callback) => {
  if (!db) {
    console.error('Database is not initialized');
    return;
  }

  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM contacts;`,
      [],
      (_, { rows }) => {
        if (rows && rows._array) {
          if (Array.isArray(rows._array)) {
            callback(rows._array);
          } else {
            console.error('Invalid rows data:', rows._array);
          }
        } else {
          console.error('No rows found or invalid data');
        }
      },
      (_, error) => console.error('Error fetching local contacts', error)
    );
  });
};

// Sync contacts from Firestore to SQLite
export const syncContactsFromFirestore = async () => {
  const user = auth.currentUser ;
  if (!user) {
    console.error('User  is not authenticated');
    return;
  }

  try {
    const userContactsCollection = collection(firestore, `users/${user.uid}/contacts`);
    const querySnapshot = await getDocs(userContactsCollection);

    if (!querySnapshot.empty) {
      querySnapshot.forEach(doc => {
        const contactData = doc.data();
        console.log('Fetched contact data:', contactData); // Debug log

        if (contactData && contactData.id && contactData.name && contactData.address && contactData.contactNumber) {
          const contact = { id: doc.id, ...contactData };
          saveContactLocally(contact); // Save to SQLite
        } else {
          console.error('Invalid contact data from Firestore:', doc.id, contactData);
        }
      });

      console.log('Contacts synced from Firestore');
    } else {
      console.log('No contacts found in Firestore');
    }
  } catch (error) {
    console.error('Error syncing contacts from Firestore', error);
  }
};

// Initialize the database when the module loads
openDatabase(); // Open the database