import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

const useFlicker = (frequency: number) => {
  const flickerAnim = useRef(new Animated.Value(1)).current;
  const [isFlickering, setIsFlickering] = useState(false);
  const animation = Animated.loop(
    Animated.sequence([
      Animated.timing(flickerAnim, {
        toValue: 0,
        duration: 1000 / frequency / 2,
        useNativeDriver: true,
      }),
      Animated.timing(flickerAnim, {
        toValue: 1,
        duration: 1000 / frequency / 2,
        useNativeDriver: true,
      }),
    ])
  );

  const startFlickering = () => {
    setIsFlickering(true);
    animation.start();
  };

  const stopFlickering = () => {
    animation.stop();
    flickerAnim.setValue(1);
    setIsFlickering(false);
  };

  useEffect(() => {
    if (isFlickering) {
      startFlickering();
    }
    return () => {
      stopFlickering();
    };
  }, [isFlickering, frequency]);

  return { flickerAnim, isFlickering, startFlickering, stopFlickering };
};

export default useFlicker;
