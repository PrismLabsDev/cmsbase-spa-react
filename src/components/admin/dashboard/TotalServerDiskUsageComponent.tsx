import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link as A } from 'react-router-dom';
import numeral from 'numeral';
import bytesToGb from '../../../utility/bytesToGb';

import {axios, http} from '../../../services/http';
import { AppContext } from '../../../contexts/AppContext';

import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

function TotalServerDiskUsageComponent({dashboardData}: any) {
  const navigate = useNavigate();
  const AppContextState: any = useContext(AppContext);

  const [totalDiskSpace, setTotalDiskSpace] = useState(0);
  const [usedDiskSpace, setUsedDiskSpace] = useState(0);
  const [diskUsagePercentage, setDiskUsagePercentage] = useState(0);

  useEffect(() => {
    setUsedDiskSpace(bytesToGb(dashboardData.total_disk_space) - bytesToGb(dashboardData.free_disk_space));
    setTotalDiskSpace(bytesToGb(dashboardData.total_disk_space));
    setDiskUsagePercentage(((bytesToGb(dashboardData.total_disk_space) - bytesToGb(dashboardData.free_disk_space)) / bytesToGb(dashboardData.total_disk_space)));
  }, [dashboardData])

  return (
    <>
      <Card>
        <CardContent>
          <Typography gutterBottom>
            Total server disk usage
          </Typography>
          
          <Grid container sx={{
            marginTop: '20px'
          }}>

            <Grid item xs={12}>
              <LinearProgress variant="determinate" value={diskUsagePercentage * 100} color={(diskUsagePercentage * 100) > 80 ? 'error' : 'primary'} />
            </Grid>

            <Grid item xs={6}>
              <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
                {numeral(usedDiskSpace).format('0,0.00')} GB / {numeral(totalDiskSpace).format('0,0.00')} GB
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography sx={{ fontSize: 12 }} color="text.secondary" align='right' gutterBottom>
                {(diskUsagePercentage * 100) > 1 ? numeral((diskUsagePercentage * 100)).format('0,0.00') : '< 1'} %
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}

export default TotalServerDiskUsageComponent;
