import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppShell, MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import PredictionPage from './components/PredictionPage';
import ExplorationPage from './components/ExplorationPage';
import Footer from './components/Footer';

const theme = createTheme({
  primaryColor: 'green',
});

function App() {
  return (
    <Router>
      <MantineProvider theme={theme}>
        <AppShell
          footer={{
            height: '52px',
          }}
        >
          <AppShell.Main>
            <Routes>
              <Route path="/" element={<ExplorationPage />} />
              <Route path="/predictions" element={<PredictionPage />} />
            </Routes>
          </AppShell.Main>
          <AppShell.Footer>
            <Footer />
          </AppShell.Footer>
        </AppShell>
      </MantineProvider>
    </Router>
  );
}

export default App;
