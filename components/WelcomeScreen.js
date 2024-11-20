import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient

export default function WelcomeScreen({ onStart }) {
  return (
    <LinearGradient
      // colors={['#FDE9EA', '#869F77', '#588061']} // Gradient colors
      // colors={['#F5F5F5', '#F5F5F5']}
      colors={['#576b4c', '#869F77', '#F5F5F5']} // Gradient colors
      start={{ x: 0, y: 0 }} // Start at the top-left corner
      end={{ x: 0, y: 1 }}   // End at the bottom-right corner
      locations={[0.2, 0.4, 0.6]} // Adjust the gradient stop points
      style={styles.gradient}
    >
      <View style={styles.container}>
        {/* <Text style={styles.greeting}>Hello!</Text> */}
        {/* <Text style={styles.appName}>PigEx</Text> */}
        <View style={styles.piglogobox}>
            {/* <Image source={require('../assets/images/logoshadow.png')} style={styles.pigLogoshadow}/> */}
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
    marginTop: 100,
    fontSize: 40,
    fontWeight: '500',
    color: '#161c12',
    letterSpacing: 1.2,
  },
  appName: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#060606',
    marginTop: 60,
    marginBottom: 200,
  },
  piglogobox: {
    // backgroundColor: 'lightblue',
    // marginTop: 200,
    // marginBottom: 50,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  pigLogoshadow: {
    // backgroundColor: 'lightgreen',
    height: '35%',
    width: 230,
    resizeMode: 'contain',
    zIndex: 2,
  },
  pigLogo: {
    // backgroundColor: 'lightgreen',
    height: '50%',
    width: 300,
    resizeMode: 'contain',
    zIndex: 1,
  },
  description: {
    // backgroundColor: 'lightblue',
    textAlign: 'center',
    color: '#060606A1',
    fontWeight: '500',
    fontSize: 17,
    // marginBottom: 60,
    paddingHorizontal: 20,
    marginTop: 5,
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: '#566F48',
    paddingVertical: 17,
    paddingHorizontal: 135,
    borderRadius: 8,
    marginTop: 110,
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
});