# React Redux Profile Management Project

This project is an implementation of a profile management system using React components and Redux for state management. The project fulfills the given requirements of managing a list of profiles, allowing users to add, delete, rename, and reorder profiles.

## Task Description

The task was to convert the provided `eq.html` into React components and utilize Redux for state management. The HTML file provided the UI structure and functionalities required for the project.

### Profile List Requirements

1. **Profile List Layout:**
   - The left panel contains the profile list.
   - The right panel displays the selected profile name.
2. **Profile Selection:**
   - Clicking a profile selects it, highlighting it in green, and updating the right panel.
3. **Move Profiles:**
   - Move up, move down, and add (+) icon are always shown.
   - Move up is disabled if the selected profile is at the top of the list.
   - Move down is disabled if the selected profile is at the bottom of the list.
4. **Default Profiles:**
   - The default profiles are: Default, Game, Movie, and Music.
   - Default profiles have their own icons.
   - Default profiles can be moved up and down but cannot be renamed or deleted.
   - Delete and rename icons are hidden if the selected profile is a default profile.
5. **Add Custom Profile:**
   - Clicking the add (+) icon allows the user to add a custom profile named "New Profile".
   - The new profile is added to the end of the list and automatically selected.
6. **Profile Deletion:**
   - If a selected profile is deleted, the profile above it is automatically selected.
7. **Profile Renaming:**
   - Renaming a profile trims the name and doesn't allow just an empty space for the name.
8. **Local Storage:**
   - Any changes made by the user are saved in the LocalStorage.
   - If no data is stored in the LocalStorage, it is populated with the 4 default profiles: Default, Game, Movie, and Music. The selected profile is "Default".
9. **Profile Data Array:**
   - The profile data array structure: `[{name: 'Default', ...}, {name: 'Game', ...}]`
   - Additional properties can be added to the profile data array to implement the requirements.

### Bonus Requirement

- **Auto-save Mechanism:**
  - After 3 seconds of a change in the profile list, a dummy API call is made, passing the profile list array.
  - If the user makes a change before the 3 seconds, the timeout is reset.

### Run the JSON server for the dummy API:

- npx json-server --watch data/profiles.json --port 3001
