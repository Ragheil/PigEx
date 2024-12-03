import { StyleSheet } from 'react-native';

const PigDetailsScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5', // Light background color
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333', // Darker text color for better contrast
    textAlign: 'center',
  },
  pigInfo: {
    fontSize: 20,
    marginBottom: 12,
    color: '#555', // Slightly lighter text color
    textAlign: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000FF', // Brand color for header
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#00FF33FF',
    borderRadius: 5,
    padding: 10,
    width: '75%',
    marginLeft: 10,
    backgroundColor: '#FFFFFF', // White background for input
    elevation: 2, // Slight shadow for input
  },
  pigContainer: {
    flex: 1,
    margin: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF', // White background for pig cards
    shadowColor: '#000', // Shadow for pig cards
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  detail: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
  },
  assignedText: {
    fontSize: 16,
    color: '#D9534F', // Bootstrap danger color for warnings
    textAlign: 'center',
    marginTop: 4,
  },
  selectButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
    elevation: 2,
  },
  selectedButton: {
    backgroundColor: '#28A745', // Success color for selected button
  },
  disabledButton: {
    backgroundColor: '#B0BEC5', // Disabled button color
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500', // Medium weight for button text
  },
  backImage: {
    width: 30, // Adjust size as needed
    height: 20, // Adjust size as needed
  },
});

export default PigDetailsScreenStyles;