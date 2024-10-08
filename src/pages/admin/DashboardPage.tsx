import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link as A } from 'react-router-dom';
import numeral from 'numeral';

import {axios, useAxios} from '../../services/http';
import { AppContext } from '../../contexts/AppContext';

import Grid from '@mui/material/Grid';

import TotalServerDiskUsageComponent from '../../components/admin/dashboard/TotalServerDiskUsageComponent';
import TotalProvisionedDiskUsageComponent from '../../components/admin/dashboard/TotalProvisionedDiskUsageComponent';
import TenantCountComponent from '../../components/admin/dashboard/TenantCountComponent';

function DashboardPage() {
  const navigate = useNavigate();
  const AppContextState: any = useContext(AppContext);
  const http = useAxios();

  const [dashboardData, setDashboardData] = useState<any>({});

  useEffect(() => {
    http.get(`/dashboard`).then((res) => {
      setDashboardData(res.data);
    });
  }, [])

  return (
    <>
      <Grid container gap={2}>
        <Grid item xs={4}>
          <TotalServerDiskUsageComponent dashboardData={dashboardData}/>
        </Grid>

        <Grid item xs={4}>
          <TotalProvisionedDiskUsageComponent dashboardData={dashboardData}/>
        </Grid>

        <Grid item xs={2}>
          <TenantCountComponent dashboardData={dashboardData}/>
        </Grid>
      </Grid>
    </>
  );
}

export {DashboardPage};
