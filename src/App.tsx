import type { Component } from 'solid-js';
import { DataProvider } from './data';
import Pomodoro from './ui/Pomodoro';
import './app.sass';

const App: Component = () => {
  return (
    <div class="app">
      <DataProvider>
        <Pomodoro />
      </DataProvider>
    </div>
  );
};

export default App;
