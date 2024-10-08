import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link as A } from 'react-router-dom';
import {useAxios, axios} from '../../../services/http';
import { AppContext } from '../../../contexts/AppContext';
import generateImageUrl from '../../../utility/generateImageUrl';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Badge from '@mui/material/Badge';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Box from '@mui/material/Box';
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
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import CloseIcon from '@mui/icons-material/Close';

import MultiSelect from '../../../components/utility/MultiSelect';

import Modal from '../../utility/Modal';

function ImageUpdateModalComponent( {open, setOpen, images, setImages, image, collections}: any ) {
  const navigate = useNavigate();
  const AppContextState: any = useContext(AppContext);
  const http = useAxios();

  const [name, setName] = useState("");
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [imageCollections, setImageCollections] = useState<any[]>([]);

  useEffect(() => {
    console.log(image);
    setName(image.name || "");
    setAltText(image.alternative_text || "");
    setCaption(image.caption || "");
    setImageCollections(image.collections?.map((collection: any) => {
      return {
        id: collection.id,
        name: collection.name,
        created_at: collection.created_at,
        updated_at: collection.updated_at,
      }
    }) || []);
  }, [image]);

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setName('');
    setAltText('');
    setCaption('');

    setOpen(false);
  }

  const toggle = () => {
    open ? handleClose() : handleOpen();
  }

  const saveImage = () => {

    const reqObj: any = {
      name: name,
      alternative_text: altText,
      caption: caption
    }

    if(name === image.name){
      delete reqObj.name;
    }

    http.patch(`/file/${image.id}`, reqObj).then((res: any) => {
      setImages(images.map((imageRecord: any) => {
        if(imageRecord.id === res.data.file.id){
          return res.data.file;
        }
        return imageRecord;
      }));

      handleClose();
    });
  }

  const onCollectionSelect = (values: any[]) => {
    http.patch(`/file/${image.id}/collection`, {
      collection_ids: values.map((value: any) => {
        return value.id;
      })
    }).then((res: any) => {
      // setImageCollections(res.data.file.collections);
      console.log(res);
    });
  };

  return (
    <>
      <Modal open={open} setOpen={setOpen} onClose={handleClose}>

            <Grid container spacing={2}>

              <Grid container item xs={6}>
                <img className='imageResize' src={generateImageUrl(image.uri, AppContextState.tenant)} alt='UpdateImageInstance'/>
              </Grid>

              <Grid container item xs={6} spacing={2}>
                <Grid item xs={12}>
                  <p>{image.file}</p>
                  <p>{image.mime_type}</p>
                  <p>{image.width}px / {image.height}px</p>
                  <p>{ Math.ceil(image.size / 1024) > 1024 ? Math.ceil(image.size / (1024 * 1024)) : Math.ceil(image.size / (1024)) } KB</p>
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="File Name" variant="outlined" type="text" value={name} onChange={(e) => {
                    setName(e.target.value);
                  }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Alt Text" variant="outlined" type="text" value={altText} onChange={(e) => {
                    setAltText(e.target.value);
                  }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Caption" variant="outlined" type="text" value={caption} onChange={(e) => {
                    setCaption(e.target.value);
                  }} />
                </Grid>

                {/* Multi select group */}
                <Grid item xs={12}>
                  <MultiSelect options={collections} preSelect={imageCollections} label="Collections" onChange={onCollectionSelect}/>
                </Grid>

                <Grid container item xs={12} gap={1}>
                  <Button variant="contained" onClick={saveImage}>Save</Button>
                  <Button color="error" variant="contained" onClick={handleClose}>Close</Button>
                </Grid>
              </Grid>

            </Grid>

      </Modal>
    </>
  );
}

export {ImageUpdateModalComponent};
