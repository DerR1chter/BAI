import { useEffect, useState } from 'react';
import { useSharedValue, withTiming, withRepeat, Easing } from 'react-native-reanimated';

const useFlicker = (frequency: number) => {
  const flickerAnim = useSharedValue(1);
  const [isFlickering, setIsFlickering] = useState(false);
  const frameDuration = 1000 / 60; // Approximate duration for one frame at 60fps
  const flickerInterval = Math.max(frameDuration, 1000 / frequency / 2); // Ensure interval is at least one frame duration

  const startFlickering = () => {
    setIsFlickering(true);
    flickerAnim.value = withRepeat(
      withTiming(0, { duration: flickerInterval, easing: Easing.linear }),
      -1,
      true
    );
  };

  const stopFlickering = () => {
    setIsFlickering(false);
    flickerAnim.value = withTiming(1, { duration: frameDuration, easing: Easing.linear });
  };

  useEffect(() => {
    if (isFlickering) {
      startFlickering();
    } else {
      stopFlickering();
    }
    return () => stopFlickering();
  }, [isFlickering, frequency]);

  return { flickerAnim, isFlickering, startFlickering, stopFlickering };
};

export default useFlicker;
