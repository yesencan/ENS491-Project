import React from 'react';

const OutputDataContext = React.createContext({
    outputData: null,
    setOutputData: () => {},
  });

export default OutputDataContext;
