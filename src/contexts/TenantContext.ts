import React from 'react';

export const TenantContext = React.createContext({
  config: null,
  setConfig: (value: any) => {},
});
