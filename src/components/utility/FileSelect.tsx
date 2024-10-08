import React, { useState, useEffect, useContext } from 'react';
import {axios, useAxios} from '../../services/http';
import { AppContext } from '../../contexts/AppContext';
import generateImageUrl from '../../utility/generateImageUrl';

import { Card } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Modal from './Modal';

function FileSelect({onChange, preselectFileId = null}: any) {

  const AppContextState: any = useContext(AppContext);
  const http = useAxios();

  const [files, setFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [openModal, setopenModal] = useState<boolean>(false);

  const selectFile = (file: any) => {
    setSelectedFile(file);
    onChange(file);
    setopenModal(false);
  }

  const removeSelectedFile = () => {
    setSelectedFile(null);
    onChange(null);
  }

  const openFileModal = () => {
    setopenModal(true);
  }

  useEffect(() => {
    http.get('/file').then((res) => {
      setFiles(res.data.files);
    });
  }, []);

  useEffect(() => {
    if(preselectFileId){
      setSelectedFile(files?.find((file: any) => {
        return file.id == preselectFileId;
      }));
    }
  }, [preselectFileId, files]);

  return (
    <>
      <Card variant="outlined">
        <CardContent>

          <Grid container spacing={2}>
            <Grid item xs={4}>
              {selectedFile ? <img
                className='imageResize'
                srcSet={generateImageUrl(selectedFile.uri, AppContextState.tenant)}
                src={generateImageUrl(selectedFile.uri, AppContextState.tenant)}
                alt={selectedFile.name}
                loading="lazy"
              /> : <span><i>Empty</i></span>}
            </Grid>
            <Grid item xs={8} container justifyContent="space-between">
              <Grid item xs={12}>
                {selectedFile ? <>
                  <p>{selectedFile.file}</p>
                  <p>{selectedFile.mime_type}</p>
                  <p>{selectedFile.width}px / {selectedFile.height}px</p>
                  <p>{ Math.ceil(selectedFile.size / 1024) > 1024 ? Math.ceil(selectedFile.size / (1024 * 1024)) : Math.ceil(selectedFile.size / (1024)) } KB</p>
                  <p>{selectedFile.caption}</p>
                  <p>{selectedFile.alternative_text}</p>
                </> : <></>}
              </Grid>
              <Grid item xs={12} container direction="row" justifyContent="center" alignItems="center" spacing={2}>
                <Grid item xs={10}>
                  <Button variant='contained' fullWidth onClick={openFileModal}>Open</Button>
                </Grid>
                <Grid item xs={2}>
                  <Button variant='contained' color='error' fullWidth onClick={removeSelectedFile}>Remove</Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Modal open={openModal} setOpen={setopenModal}>
            <Card>
              <CardContent>
                <ImageList variant="masonry" cols={4} gap={8}>
                  {files.map((file: any) => (
                    <ImageListItem key={`ImageListItem-${file.id}`}>
                      <img
                        className='hoverClick'
                        srcSet={generateImageUrl(file.uri, AppContextState.tenant)}
                        src={generateImageUrl(file.uri, AppContextState.tenant)}
                        alt={file.name}
                        loading="lazy"
                        onClick={() => {
                          selectFile(file);
                        }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </CardContent>
            </Card>
          </Modal>
          
        </CardContent>
      </Card>
    </>
  );
}

export default FileSelect;
