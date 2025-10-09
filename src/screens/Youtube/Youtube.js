import React from 'react';
import { StyleSheet, View, Dimensions, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

export default function MainPageWithYouTube() {
  const iframeHtml = `
    <html>
      <body style="margin:0;padding:0;overflow:hidden;background:#000;">
        <iframe 
          width="100%" 
          height="100%" 
          src="https://www.youtube.com/embed/GCe6_LTWTn0?si=LtMMwyQmGnbLIEyH&autoplay=0&modestbranding=1&rel=0"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      </body>
    </html>
  `;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <WebView
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          source={{ html: iframeHtml }}
          allowsFullscreenVideo={true}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  container: {
    width: width * 0.95,
    aspectRatio: 16 / 9, // Maintain proper aspect ratio
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
  },
});
