import { StyleSheet } from 'react-native';

const PregnancyRecordsStyles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  groupName: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  pigName: { fontSize: 16, marginBottom: 5 },
  pigContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewIcon: { width: 24, height: 24, marginRight: 10 },
  addButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  modalBackground: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.5)' 
  },
  modalContainer: { 
    width: 300, 
    padding: 20, 
    backgroundColor: '#ffffff',  // Set to white
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  pigletName: { fontSize: 16, marginBottom: 5 },
  noPigletsText: { fontSize: 16, fontStyle: 'italic', color: 'gray' },
  closeButton: { marginTop: 20, color: 'blue', textAlign: 'center' },
});

export default PregnancyRecordsStyles;
