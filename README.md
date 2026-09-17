# Run Mapper

Run Mapper is a mobile application that tracks and visualizes a user’s movement during a run or walk. The application uses location services to display the user’s route, track elapsed time, calculate distance traveled, and determine average speed.

## Features

- Real-time GPS route tracking
- Interactive map displaying the user’s current location
- Start and end markers for each route
- Continuously updated route visualization
- Built-in stopwatch
- Distance calculation with GPS noise filtering
- Average-speed calculation
- Run summary displaying time, distance, and speed
- Ability to reset and record multiple routes

## How It Works

### Welcome Screen

The Welcome screen displays the Run Mapper title, logo, and a **Start Run!** button. Selecting this button takes the user to the Run screen.

### Run Screen

The Run screen displays an interactive map with a blue dot representing the user’s current location. Beneath the map are **Start** and **Stop** buttons and a stopwatch.

When the user selects **Start**:

- The stopwatch begins.
- The map focuses on the user’s route.
- A green marker identifies the starting location.
- A blue line begins tracing the user’s movement.
- The application continuously records new location coordinates.

Selecting the green marker displays its **Start** label.

When the user selects **Stop**:

- Location tracking and the stopwatch stop.
- A red marker identifies the ending location.
- A Run Summary appears.

## Run Summary

The Run Summary displays:

- Total elapsed time
- Distance traveled in kilometers
- Average speed in kilometers per hour

To reduce the effect of minor GPS fluctuations, movements of five meters or less between recorded coordinates are excluded from the distance calculation.

Selecting **Done** closes the summary, clears the recorded route and markers, and resets the stopwatch so the user can begin another run.

Users can return to the Welcome screen at any time by selecting **< Welcome** in the navigation bar.

## Technologies

- TypeScript
- React Native
- Expo
- Expo Location
- React Native Maps
- React Navigation
- Geolib

## Running the Project

1. Clone the repository:

```bash
git clone https://github.com/tanishka-10/run-mapper.git
```

2. Enter the project directory:

```bash
cd run-mapper
```

3. Install the dependencies:

```bash
npm install
```

4. Start the Expo development server:

```bash
npx expo start
```

5. Open the application using Expo Go or a compatible simulator.

Location permissions must be enabled for route tracking to work.

