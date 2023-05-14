import { useState, useEffect, useRef } from 'react';
import { StatusBar, ImageBackground, TouchableOpacity, Dimensions, Animated, Easing, UIManager, findNodeHandle } from 'react-native';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { PanGestureHandler } from "react-native-gesture-handler";
import { GestureEventType } from "../Imports/Types";

const { height, width } = Dimensions.get('window');
  
export default function Game() {

  const [game, setGame] = useState(false);

  const [Character, setCharacter] = useState(20);
  const [panelLeft, setPanelLeft] = useState(0.5);
  // const [pillerLeft, setPillerLeft] = useState(0.5);
  const [boxHeight, setBoxHeight] = useState(0.9);
  const [animation] = useState(new Animated.Value(height * 0.9));
  const [buttonPressed, setButtonPressed] = useState(true);
  const [panelAnimation] = useState(new Animated.Value(width * 0.5));
  const [pillerAnimation] = useState(new Animated.Value(width * 0.2));

const [barGap, setBarGap] = useState(0.38);
const generateRandomNumber = () => {
  const randomNumber = Math.floor(Math.random() * (60 - 18 + 1)) + 18;
  const randomBy100 = (randomNumber / 100)
  setBarGap(randomBy100);
  console.log(randomBy100);
};
useEffect(() => {
  let intervalId: NodeJS.Timeout;
  if (game) {
    intervalId = setInterval(() => {
      generateRandomNumber();
    }, 3000);
  }

  return () => clearInterval(intervalId);
}, [game]);


  const handleButtonPress = () => {
    setGame(!game);
    setBoxHeight(boxHeight === 0.1 ? 0.9 : 0.1);
    setPanelLeft(panelLeft === 0.05 ? 0.5 : 0.05);
    setButtonPressed(true);
    setTimeout(() => {
    setCharacter(20);
  }, 300);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
  
    if (game) {
      interval = setInterval(() => {
        setCharacter(prevCharacter => {
          const nextCharacter = prevCharacter + 1;
          if (nextCharacter > 87) {
            clearInterval(interval);
            handleButtonPress();
            return prevCharacter;
          }
          return nextCharacter;
        });
      }, 100);
    }
  
    return () => clearInterval(interval);
  }, [game, handleButtonPress]);
  

  const handleGesture = ({ nativeEvent: { translationY } }: GestureEventType) => {
    const nextCharacter = translationY > 0 ? Character + 1 : Character - 3;
    if (nextCharacter > 87) {
      handleButtonPress();
    } else if (nextCharacter >= 0) {
      setCharacter(nextCharacter);
    }
  };
  

  useEffect(() => {
    if (buttonPressed) {
      Animated.timing(animation, {
        toValue: height * boxHeight,
        duration: 400,
        easing: Easing.linear,
        useNativeDriver: false
      }).start();
  
      setTimeout(() => {
        Animated.timing(panelAnimation, {
          toValue: width * panelLeft,
          duration: 400,
          easing: Easing.linear,
          useNativeDriver: false
        }).start();
      }, 300);

        // Animated.timing(pillerAnimation, {
        //   toValue: width * pillerLeft,
        //   duration: 3000,
        //   easing: Easing.linear,
        //   useNativeDriver: false
        // }).start();
     

    }

  }, [boxHeight, buttonPressed, panelLeft]);


  return (
    <View style={styles.OuterBackground}>

      {/* drop down and intro screen */}

      <View style={styles.background}>
        <Animated.View style={[styles.container, { width: width * 0.9, height: animation, top: height * 0.05 }]}>
          {!game ? (
            <>
              <View><Text>the logo</Text></View>
              <View><Text>best score</Text></View>
              <View>
                <TouchableOpacity onPress={handleButtonPress}>
                  <Text style={styles.button}>Start</Text>
                </TouchableOpacity>
              </View>
              <View><Text>scare a friend</Text></View>
              <View><Text>information on game</Text></View>
              <View><Text>Turn of sound / music</Text></View>
              <View><Text>The score you just got</Text></View>
            </>
          ) : (
            <>
              <View><Text>your current score</Text></View>
            </>
          )}
        </Animated.View>
      </View>

      {/* Character */}
    
<PanGestureHandler onGestureEvent={handleGesture}>

<View style={styles.characterOutside}>
        <Animated.View style={[styles.characterPanel, { left: panelAnimation }]}>
          <View style={[styles.Character, { top:`${Character}%` }]}>
            <Text>the charater</Text>
            </View>
        </Animated.View>
      </View>

      </PanGestureHandler> 


{/*  moving pillers  */}

<View style={styles.pillerOutside}>

<Animated.View style={[styles.pillerBar, { left: pillerAnimation }]}>
  <View style={[styles.pillerBarTop, { height: height * barGap }]}></View>
  <View style={[styles.pillerBarBottom, { height: height * (0.75 - barGap) }]}></View>
  </Animated.View>
  </View>

    </View>



  );
}



const styles = StyleSheet.create({
  OuterBackground: {
    flex: 1,
    position: 'relative',
    zIndex: 100
  },
  background: {
    flex: 1,
    display: "flex",
    zIndex: 30,
  },
  container: {
    backgroundColor: '#FFFFFF',
    display: "flex",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "black",
    alignSelf: 'center',
    zIndex: 20,
  },
  button: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 10,
  },
  characterOutside: {
    display: "flex",
    width: width,
    height: height,
    zIndex: 10,
  },
  characterPanel: {
    width: width * 0.2,
    height: height * 0.7,
    top: height * 0.2,
    // backgroundColor: "green",
  },
  Character: {
    width: width * 0.2,
    height: width * 0.2,
    backgroundColor: "green",
    borderRadius: (width * 0.2) / 2,
  },
  pillerOutside: {
    display: "flex",
    width: width,
    height: height,
    position: 'absolute',
    zIndex: 1,
  },
  pillerBar: {
    width: width * 0.15,
    height: height,
    // backgroundColor: "yellow",
    left: width * 0.5,
  },
  pillerBarTop: {
    width: width * 0.15,
    backgroundColor: "blue",
    top: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  pillerBarBottom: {
    width: width * 0.15,
    backgroundColor: "red",
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
  }
});