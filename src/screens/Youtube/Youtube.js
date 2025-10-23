import React from "react";
import { StyleSheet, View, Dimensions, ScrollView } from "react-native";
import { WebView } from "react-native-webview";

const { width } = Dimensions.get("window");

export default function MainPageWithYouTube() {
  const iframeHtml = `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { margin:0; padding:0; overflow:hidden; background:#000; }
        iframe { width:100%; height:100%; border:0; }
      </style>
    </head>
    <body>
      <iframe 
        src="https://www.youtube.com/embed/QaNrBVqmsNc?autoplay=1&mute=1&playsinline=1"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen>
      </iframe>
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
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 5,
  },
  container: {
    width: width * 0.90,
    height: width * 0.90 * (9 / 16), // Maintain 16:9 aspect ratio
    aspectRatio: 16 / 9, // Keep standard YouTube aspect ratio
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    backgroundColor: "#000",
  },
  webview: {
    flex: 1,
  },
});
