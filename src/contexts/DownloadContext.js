// src/contexts/DownloadContext.js
import React, { createContext, useContext, useState } from "react";

const DownloadContext = createContext();

export const DownloadProvider = ({ children }) => {
  const [downloadedMovies, setDownloadedMovies] = useState([]);

  const addToDownloads = (movie) => {
    setDownloadedMovies((prevDownloads) => [...prevDownloads, movie]);
  };

  return (
    <DownloadContext.Provider value={{ downloadedMovies, addToDownloads }}>
      {children}
    </DownloadContext.Provider>
  );
};

export const useDownloads = () => useContext(DownloadContext);
