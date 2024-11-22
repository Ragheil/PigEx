import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient

export default function WelcomeScreen({ onStart }) {
  return (
    <LinearGradient
      colors={['#576b4c', '#869F77', '#F5F5F5']} // Gradient colors
      start={{ x: 0, y: 0 }} // Start at the top-left corner
      end={{ x: 0, y: 1 }}   // End at the bottom-right corner
      locations={[0.28, 0.42, 0.6]} // Adjust the gradient stop points
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.container}>
          <View style={styles.piglogobox}>
            <Image source={require('../assets/images/LOGO.png')} style={styles.pigLogo} />
          </View>
          <Text style={styles.title}>Welcome to PigEx!</Text>
          <Text style={styles.description}>
            Our app is here to help swine farmers effortlessly track expenses, manage farm records, and boost productivity all in one easy-to-use tool.
          </Text>
          <TouchableOpacity style={styles.startButton} onPress={onStart}>
            <Text style={styles.startButtonText}>Start Now</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeAreaView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    marginBottom: Platform.OS === 'android' ? 40 : 0, // Add extra space for Android navigation bar
  },
  title: {
    marginTop: 70,
    fontSize: 40,
    fontWeight: '500',
    color: '#161c12',
    letterSpacing: 1.2,
  },
  piglogobox: {
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pigLogo: {
    height: '50%',
    width: 300,
    resizeMode: 'contain',
    zIndex: 1,
  },
  description: {
    textAlign: 'center',
    color: '#060606A1',
    fontWeight: '500',
    fontSize: 17,
    paddingHorizontal: 20,
    marginTop: 5,
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: '#566F48',
    paddingVertical: 17,
    paddingHorizontal: 35, // Adjust the horizontal padding for smaller screens
    borderRadius: 8,
    marginTop: 150,
    marginBottom: 20, // Adjust bottom margin for proper spacing
    flexDirection: 'row', // Ensure "Start Now" stays in one row
    justifyContent: 'center', // Center the text horizontally
    maxWidth: 300, // Limit the maximum width of the button
    width: '80%', // Set the width to 80% of the screen width
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center', // Ensure text stays centered
  },
});
