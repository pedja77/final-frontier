import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { NavLink } from 'react-router-dom';
import { checkImageUrl } from '../../utils/paths';
import { useState } from 'react';
import { useEffect } from 'react';
import { Avatar } from '@mui/material';

const TeacherCard = ({teacher}) => {  

    return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        alt="Image of the teacher"
        height="140"
        image={checkImageUrl(
          `teacher_${teacher.id}.jpg`, (imageExists) => 
            imageExists ?  `teacher_${teacher.id}.jpg` : "portrait_placeholder.jpeg")}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {`${teacher.firstName} ${teacher.lastName}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Nedeljni fond časova: {teacher.weeklyClasses}
        </Typography>
      </CardContent>
      <CardActions sx={{display: 'flex', flexDirection: 'row-reverse'}}>
        <Button size="small" component={NavLink} to={`/teachers/${teacher.id}`}>Prikaži</Button>
      </CardActions>
    </Card>
  );
}

export default TeacherCard;