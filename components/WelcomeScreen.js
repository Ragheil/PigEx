import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient

export default function WelcomeScreen({ onStart }) {
  return (
    <LinearGradient
      colors={['#FDE9EA', '#869F77', '#588061']} // Gradient colors
      // colors={['#F5F5F5', '#F5F5F5']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        {/* <Text style={styles.greeting}>Hello!</Text> */}
        {/* <Text style={styles.appName}>PigEx</Text> */}
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  greeting: {
    fontSize: 20,
    marginBottom: 10,
    color: '#000',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 1.5,
  },
  appName: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#060606',
    marginTop: 80,
    marginBottom: 200,
  },
  piglogobox: {
    // backgroundColor: 'lightblue',
    // marginTop: 50,
    marginBottom: 100,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  pigLogo: {
    // backgroundColor: 'lightgreen',
    height: '35%',
    width: 230,
    resizeMode: 'contain',

  },
  description: {
    // backgroundColor: 'lightblue',
    textAlign: 'center',
    color: '#060606',
    fontWeight: '450',
    marginBottom: 60,
    paddingHorizontal: 30,
    marginTop: 5,
    lineHeight: 18,
  },
  startButton: {
    backgroundColor: '#566F48',
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 8,
    marginTop: 120,
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
