import { StyleSheet } from 'react-native';

const PigDetailsScreenStyles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  pigInfo: { fontSize: 18, marginBottom: 8 },
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    width: '60%',
    marginLeft: 10,
  },
  pigContainer: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
  },
  detail: { fontSize: 16, textAlign: 'center' },
  assignedText: { fontSize: 14, color: 'red', textAlign: 'center' },
  selectButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  selectedButton: {
    backgroundColor: '#28A745',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: { color: '#fff', fontSize: 16 },
});

export default PigDetailsScreenStyles;
