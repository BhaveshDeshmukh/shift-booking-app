\# React Native Shift Booking Application



A React Native shift booking application developed for the \*\*Kiran Foundation – React Native Developer Intern Round 2 Assignment\*\*.



The application uses the provided mock API to allow users to browse, filter, book and cancel shifts.



\---



\##  Features



\### Available Shifts



\- View all available shifts

\- Filter shifts by city/location

\- Shifts are grouped by dates

\- Book available shifts

\- Cancel booked shifts

\- Clear booking status and action states



\### My Shifts



\- View all booked shifts

\- Shifts are grouped by dates

\- Cancel booked shifts

\- View the current booking count



\### Additional UX Improvements



In addition to the required functionality, the application includes:



\- Clean and modern responsive UI

\- Improved loading and empty states

\- Error handling for failed API operations

\- Consistent visual design and colour system

\- Interactive \*\*Shift Assistant\*\* for quick help with common actions

\- Easy navigation between Available Shifts and My Shifts



\---



\##  Tech Stack



\- \*\*React Native\*\*

\- \*\*Expo\*\*

\- \*\*JavaScript\*\*

\- \*\*React Navigation\*\*

\- \*\*TanStack React Query\*\*

\- \*\*Axios\*\*

\- \*\*Styled Components\*\*

\- \*\*Node.js\*\*

\- \*\*Hapi.js\*\* – Mock API



\---



\##  Project Structure



```text

shift-booking-app/

│

├── assets/

│

├── src/

│   ├── api/

│   │   └── index.js

│   │

│   ├── components/

│   │   └── ShiftAssistant.js

│   │

│   ├── screens/

│   │   ├── AvailableShiftsScreen.js

│   │   └── MyShiftsScreen.js

│   │

│   └── utils/

│       └── index.js

│

├── App.js

├── index.js

├── package.json

└── README.md

