import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link as A } from 'react-router-dom';
import {useAxios, axios} from '../../../services/http';
import { AppContext } from '../../../contexts/AppContext';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import DeleteIcon from '@mui/icons-material/Delete';

import { PageCardFieldsComponent } from './PageCardFieldsComponent';

function PageCardComponent( {page, pages, setPages}: any ) {
  const navigate = useNavigate();
  const AppContextState: any = useContext(AppContext);
  const http = useAxios();

  const deletePage = (page: any) => {
    http.delete(`/page/${page.id}`).then(() => {
      setPages(pages.filter((pageRecord: any) => {
        return pageRecord.id !== page.id;
      }))

      const appPagesState = AppContextState.pages.filter((pageRecord: any) => {
        return pageRecord.id !== page.id;
      });
      AppContextState.setPages(appPagesState);
      localStorage.setItem("pages", JSON.stringify(appPagesState));
    });
  } 

  const publishPageToggle = (page: any) => {
    http.patch(`/page/${page.id}`, {
      published: !page.published
    }).then((res) => {
      setPages(pages.map((pageRecord: any) => {
        if(pageRecord.id === res.data.page.id){
          return res.data.page;
        }
        return pageRecord;
      }));
    });
  }

  return (
    <>
      <Card variant="outlined">

        <CardContent>
          <Grid container spacing={2}>
            <Grid container item xs={6} gap={2}>

              <Typography variant="h5" gutterBottom>
                {page.name}
              </Typography>

              <Typography variant="h5" gutterBottom>
                {page.published ? (
                  <VisibilityIcon color='primary'/>
                ) : (
                  <VisibilityOffIcon color='warning'/>
                )}
              </Typography>

            </Grid>
            <Grid container item xs={6} justifyContent="flex-end">

              <IconButton aria-label="delete" onClick={() => {
                publishPageToggle(page);
              }}>
                {page.published ? (
                  <VisibilityIcon fontSize="inherit"/>
                ) : (
                  <VisibilityOffIcon fontSize="inherit"/>
                )}
              </IconButton>

              <IconButton aria-label="delete" onClick={() => {
                deletePage(page);
              }}>
                <DeleteIcon />
              </IconButton>

            </Grid>
          </Grid>
        </CardContent>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <PageCardFieldsComponent page={page}/>
          </Grid>
        </Grid>

      </Card>
    </>
  );
}

export {PageCardComponent};
