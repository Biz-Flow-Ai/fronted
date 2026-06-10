const { useState, useEffect } = React;

function App() {
  return (
    <div className="app-container">
      <GlobalSetup />
      <Nav />
      <LandingPage />
      <Footer />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
