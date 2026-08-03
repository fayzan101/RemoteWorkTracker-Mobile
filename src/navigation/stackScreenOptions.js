import { colors } from '../theme/colors';

/** Shared native-stack header look — teal app bar + soft content canvas. */
export const stackScreenOptions = {
  headerStyle: {
    backgroundColor: colors.appBar,
  },
  headerShadowVisible: false,
  headerTintColor: colors.appBarText,
  headerTitleStyle: {
    fontWeight: '700',
    fontSize: 18,
    color: colors.appBarText,
  },
  headerTitleAlign: 'center',
  contentStyle: {
    backgroundColor: colors.background,
  },
  animation: 'slide_from_right',
};
