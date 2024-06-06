import React from 'react';
import { SidebarProvider } from './SidebarContext';
import Sidebar from './Sidebar';
import Home from '../../home/Home';

function App() {
  return (
    <SidebarProvider>
      <Sidebar />
      <Home />
    </SidebarProvider>
  );
}

export default App;
