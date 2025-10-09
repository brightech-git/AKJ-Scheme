import { useState, useEffect } from 'react';
import * as Font from 'expo-font';

const useFonts = async () => {
  await Font.loadAsync({
    TrajanProBold: require('../assets/font/TrajanPro-Bold.otf'),
    DMSerif: require('../assets/font/DMSerif.ttf'),
    DancingScript : require('../assets/font/DancingScript.ttf'),
    Fancy: require('../assets/font/Fancy.ttf'),
    Domine: require('../assets/font/Domine-Bold.ttf'),
  });
};

export default useFonts;
