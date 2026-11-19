# Frame — movies for the big screen

A small, API-key-free TV movie catalogue. Twenty fictional movies, four genres,
seeded Picsum photographs, a responsive grid, and a live focused-movie detail panel.
No video playback, accounts, or backend. Images require internet access; a title
placeholder appears if an image fails.

## Layout

```
packages/shared-ui/       TypeScript dataset, MovieList, MovieCard, arrow navigation
apps/expo-multi-tv/       Expo 54 / react-native-tvos 0.81, Android TV + tvOS + web
apps/vega/                Vega 2 / Kepler 4 scaffold, manifest, Metro + Babel
```

All three are Yarn workspaces. The Vega renderer and React 19.2 are resolved
separately from Expo's React 19.1 and react-native-tvos. Vega Metro maps shared
`react-native` imports to Amazon's Kepler implementation and pins React resolution
to the Vega app so shared hooks use the same runtime.

## Setup / web

Use Node 22.14+ (tested with 24.22.2), Yarn 1.22.22:

```sh
corepack enable
yarn install --frozen-lockfile
yarn typecheck
yarn test
yarn web
# Static production build:
yarn export:web
python -m http.server 8080 --directory apps/expo-multi-tv/dist
```

Visit http://localhost:8080 for the static build. Use arrow keys to move across
the grid (up/down move one responsive row), Tab/Shift-Tab for sequential focus,
and Enter or a mouse click to select. A lime border and scale mark the current
movie. Detail content follows focus. On native TV, focus events and the platform
focus engine handle the D-pad. The grid clamps keyboard navigation at its ends.

## Android TV and Fire TV

Install Android Studio / Android SDK, Java 17, and create an **Android TV** AVD.
Start the TV emulator first, or connect a Fire TV with developer mode/ADB enabled:

```sh
adb connect FIRE_TV_IP:5555  # only for a physical Fire TV
cd apps/expo-multi-tv
EXPO_TV=1 npx expo prebuild --platform android --no-install
cd ../..
yarn android
# Release APK (configure your own release signing for distribution):
cd apps/expo-multi-tv/android
./gradlew assembleRelease
```

The TV config plugin generates a leanback launcher, TV banner, and marks a
touchscreen as optional. Android TV and Android-based Fire TV use the same app.
Generated android/ios folders are intentionally ignored; regenerate with prebuild.
Do not use the phone Expo Go client for native TV.
For repeatable future emulator sessions, include Android SDK/AVD setup in your
machine's declarative environment (blueprint).

## Apple tvOS

Requires macOS, Xcode with the tvOS platform installed, CocoaPods, and an Apple TV
simulator or device. On a Mac:

```sh
cd apps/expo-multi-tv
EXPO_TV=1 npx expo prebuild --platform ios
EXPO_TV=1 npx expo run:ios --device
# Choose an Apple TV simulator, not an iPhone.
# Open ios/*.xcworkspace in Xcode to archive/sign for an Apple TV device.
```

The root `yarn ios` also sets EXPO_TV=1. It is essential to set this variable
at prebuild time to generate tvOS rather than iOS projects.

## Vega OS

This is a separate native host, not an Expo target. Its structure follows Amazon's
react-native-multi-tv-app-sample: Kepler application metadata, a TOML component
manifest, AppRegistry component matching the manifest ID, and the build-vega CLI.
Dependencies are installable from npm, but a native build requires Amazon's
Vega SDK 2 / Kepler 4 toolchain and an SDK-configured environment.

1. Install and initialize the Vega SDK following Amazon's developer documentation.
   Activate its environment and start a Vega virtual device (or attach a device).
2. From this repository root, run `yarn install --frozen-lockfile`.
3. Run `yarn vega` for Metro if developing with a debug device.
4. Run `yarn workspace @tv/vega build:debug` or `yarn build:vega` for Release.
   These invoke `react-native build-vega --build-type Debug|Release`.
5. Install/launch the produced package with the device tools supplied by your SDK
   (`vega exec vda`); use the output package path printed by build-vega.

The manifest only requests input/network services: this app is a catalogue,
not a media player. Validate the scaffold and permissions against your installed
SDK before shipping.

## Verification on this Linux machine

- Shared UI and Expo TypeScript checks passed (`tsc --noEmit` for each).
- Navigation unit tests cover normal movement, boundaries, empty input, and
  unsupported keys.
- Expo production web export succeeded. Static output served on port 8080;
  `curl -s localhost:8080 | head` returned the HTML page.
- Chrome visually showed loaded posters. Right arrow moved focus from
  The Quiet Earth to Beyond the Blue and updated its detail panel.
  Screenshot: `/home/ubuntu/tv-movies-web.png`.
- Android TV prebuild succeeded with EXPO_TV=1. Generated AndroidManifest.xml
  contains `android.intent.category.LEANBACK_LAUNCHER`, a TV banner, and
  `android.hardware.touchscreen` with `required="false"`.
- No Gradle/APK build or native remote/device test was run. Fire TV and Android TV
  runtime behavior is unverified. tvOS cannot be built on Linux; it needs a Mac.
  Vega native build/runtime is unverified because the Vega SDK is not installed.
- Yarn reports upstream deprecated packages and peer-dependency warnings; these
  did not prevent installation/export. No remote is configured and nothing is pushed.
