import {useEffect, useState} from 'react';
import {
  useSharedValue,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

/**
 * Custom hook to manage a flicker animation effect.
 * @param {number} frequency - The frequency of the flicker in Hz.
 * @returns {{
 *   flickerAnim: { value: number },
 *   isFlickering: boolean,
 *   startFlickering: () => void,
 *   stopFlickering: () => void
 * }} The flicker animation value, flickering state, and control functions.
 */
const useFlicker = (frequency: number) => {
  // Shared value for the flicker animation
  const flickerAnim = useSharedValue(1);
  // State to manage whether flickering is active
  const [isFlickering, setIsFlickering] = useState(false);
  // Duration for one frame at 60fps
  const frameDuration = 1000 / 60;
  // Interval for the flicker effect, ensuring it's at least one frame duration
  const flickerInterval = Math.max(frameDuration, 1000 / frequency / 2);

  /**
   * Starts the flicker animation.
   */
  const startFlickering = () => {
    setIsFlickering(true);
    flickerAnim.value = withRepeat(
      withTiming(0, {duration: flickerInterval, easing: Easing.linear}),
      -1,
      true,
    );
  };

  /**
   * Stops the flicker animation.
   */
  const stopFlickering = () => {
    setIsFlickering(false);
    flickerAnim.value = withTiming(1, {
      duration: frameDuration,
      easing: Easing.linear,
    });
  };

  // Effect to start or stop the flickering based on state changes
  useEffect(() => {
    if (isFlickering) {
      startFlickering();
    } else {
      stopFlickering();
    }
    // Cleanup function to stop flickering when the component unmounts
    return () => stopFlickering();
  }, [isFlickering, frequency]);

  return {flickerAnim, isFlickering, startFlickering, stopFlickering};
};

export default useFlicker;
