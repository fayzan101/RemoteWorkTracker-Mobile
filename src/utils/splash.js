import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync().catch(() => {
  // Splash may already be hidden in some reload paths.
});

export async function hideAppSplash() {
  try {
    await SplashScreen.hideAsync();
  } catch {
    // no-op
  }
}
