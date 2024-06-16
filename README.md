# EEGChat

This repository presents a smartphone application for a Conversational Brain-Artificial Intelligence Interface (cBAI), done by Yehor Chulkov as part of his bachelor's thesis in SS2024 at the University of Vienna, supervised by Univ.-Prof. Dr.-Ing. Moritz Grosse-Wentrup. The application is based on the work of the Research Group Neuroinformatics and their paper "A Conversational Brain-Artificial Intelligence Interface". The primary objective was to create a mobile application for Android and iOS devices that replicates the functionalities of the existing Windows-based desktop application described in the paper (https://github.com/AKMeunier/EEGChat). The resulting application maintains all core features of the original desktop version, offering enhanced accessibility and portability.

## Prerequisites

- Operating System: MacOS, Linux, or Windows (supporting virtualization)
- Virtual Android device or physical Android device with the APK installed
- NodeJS (version 18 or higher)
- OpenJDK17
- Android Studio

### Step-by-Step Setup Instructions

### Step 1: Install Necessary Software

1. **Install NodeJS** (version 18 or higher):
   Download and install from [NodeJS website](https://nodejs.org/).

2. **Install OpenJDK17**:
   Download and install from [AdoptOpenJDK](https://adoptopenjdk.net/).

3. **Install Android Studio**:
   Download and install from [Android Studio website](https://developer.android.com/studio).

### Step 2: Configure Environment Variables

1. **Set `ANDROID_HOME` Environment Variable**:
   - For **Windows**:
     ```
     setx ANDROID_HOME "C:\path\to\your\Android\Sdk"
     ```
   - For **Mac/Linux**:
     ```
     export ANDROID_HOME=$HOME/Library/Android/sdk
     ```

2. **Add `platform-tools` to System Path**:
   - For **Windows**:
     ```
     setx PATH "%PATH%;%ANDROID_HOME%\platform-tools"
     ```
   - For **Mac/Linux**:
     ```
     export PATH=$PATH:$ANDROID_HOME/platform-tools
     ```

### Step 3: Set Up Android Virtual Device

1. **Open Android Studio**:
   - Go to "More Actions" -> "Virtual Device Manager"
   - Add a new device with API Level 34 (UpsideDownCake)
   - Complete the setup and start the created virtual device

### Step 4: Clone the Project Repository

1. **Clone the Repository**:
   ```
   git clone https://github.com/YehorChulkov/BAI.git
   cd BAI
   ```

2. **Add API Key**:
   - Insert the OpenAI API key into `APIKeysConfig.js` in the "Configs" folder.

3. **Install Dependencies**:
   ```
   npm install
   ```

### Step 5: Start the Metro Server

1. **Start Metro**:
   ```
   npm start
   ```

### Step 6: Choose the operating system to run on

   ```
a — for Android  
i — for iOs (available on MacOS only)
   ```

If everything is set up correctly, you should see the app running in the Android Emulator or iOS Simulator (MacOS only).

### Running the App on a Physical Android Device

1. **Download the APK file from GitHub** and transfer it to your device.
2. **Install the APK** using the file manager on the device.
3. **Start the app** from the installed apps list.


# Generating an APK

To generate an APK, follow these steps:

### Step 1: Bundle the React Native Code and Assets

Go to the root of the project in the terminal and run the following command:

```
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
```

### Step 2: Navigate to the Android Directory

```
cd android
```

### Step 3: Assemble the Debug APK
On Linux/MacOs
```
./gradlew assembleDebug
```
or
```
.\gradlew assembleDebug
```
on Windows.

The APK file can be found the following path:
```
eegchat/android/app/build/outputs/apk/debug/app-debug.apk
```

## Congratulations!

You've successfully run the app! 🥳

