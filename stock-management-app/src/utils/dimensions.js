import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 14 / Pixel 6 reference: 390 x 844)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

/**
 * Converts a percentage of the screen width to dp.
 * @param {number} percent - e.g. 50 => 50% of screen width
 */
export const wp = (percent) => (SCREEN_WIDTH * percent) / 100;

/**
 * Converts a percentage of the screen height to dp.
 * @param {number} percent - e.g. 50 => 50% of screen height
 */
export const hp = (percent) => (SCREEN_HEIGHT * percent) / 100;

/**
 * Scale a size proportionally to the screen width.
 * Useful for font sizes or layout dimensions.
 */
export const scale = (size) => (SCREEN_WIDTH / BASE_WIDTH) * size;

/**
 * Moderately scale a size — less aggressive than `scale`.
 * factor = 0 means no scaling, factor = 1 means full scaling.
 */
export const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

/**
 * Normalize font sizes — clamps to a reasonable max/min.
 */
export const normalize = (size) => {
  const newSize = scale(size);
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

/** True for devices narrower than 360dp (e.g. older Android phones) */
export const isSmallDevice = SCREEN_WIDTH < 360;

/** True for devices 428dp wide or wider (e.g. iPhone Pro Max, Pixel 7 Pro) */
export const isLargeDevice = SCREEN_WIDTH >= 428;

/** The current screen width */
export const screenWidth = SCREEN_WIDTH;

/** The current screen height */
export const screenHeight = SCREEN_HEIGHT;

/**
 * Minimum recommended touch target size (Apple HIG / Material Design).
 * Use this as a minimum `width` / `height` for interactive elements.
 */
export const MIN_TOUCH_SIZE = 44;

/**
 * Standard card padding that adapts to device size.
 */
export const CARD_PADDING = isSmallDevice ? 12 : 16;

/**
 * Standard horizontal screen padding.
 */
export const SCREEN_PADDING = isSmallDevice ? 14 : 16;

/**
 * Bottom tab bar height (accounts for home indicator on modern iOS).
 */
export const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 82 : 68;
