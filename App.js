import React from "react";
import Navigation from "./src/Layout/Navigation";
import { MyListProvider } from "./src/contexts/MyListContext";
import { ConnectivityProvider } from "./src/contexts/ConnectivityProvider";
import { DownloadProvider } from "./src/contexts/DownloadContext";

const App = () => {
  return (
    <ConnectivityProvider>
      <MyListProvider>
        <DownloadProvider>
          <Navigation />
        </DownloadProvider>
      </MyListProvider>
    </ConnectivityProvider>
  );
};

export default App;
