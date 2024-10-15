// import React, { useState } from "react";
// import ReportingPage from "./Pages/ReportingPage";
// const App = () => {
//   return <ReportingPage />;
// };

// export default App;

// import React, { useState } from "react";
// import ReportingForm from "./components/ReportingForm"; // Adjust the path as necessary
// import ReportsPage from "./components/Reports"; // Adjust the path as necessary

// const App = () => {
//   const [showReports, setShowReports] = useState(false);

//   const toggleReports = () => {
//     setShowReports((prev) => !prev);
//   };

//   return (
//     <div>
//       <button onClick={toggleReports}>
//         {showReports ? "Go to Reporting" : "View Reports"}
//       </button>
//       {showReports ? <ReportsPage /> : <ReportingForm />}
//     </div>
//   );
// };

// export default App;

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReportingForm from "./components/ReportingForm"; // Adjust the path as necessary
import ReportsPage from "./components/Reports"; // Adjust the path as necessary

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ReportingForm />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

