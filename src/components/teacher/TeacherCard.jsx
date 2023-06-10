import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { NavLink } from "react-router-dom";
import { useImage } from "react-image";

const TeacherCard = ({ teacher }) => {
  const { src } = useImage({
    srcList: [`teacher_${teacher.id}.jpg`, "./avatar.png"],
  });
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        alt="Image of the teacher"
        height="140"
        src={src}
        loading="lazy"
        // image={checkImageUrl(
        //   `teacher_${teacher.id}.jpg`, (imageExists) =>
        //     imageExists ?  `teacher_${teacher.id}.jpg` : "portrait_placeholder.jpeg")}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {`${teacher.firstName} ${teacher.lastName}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Nedeljni fond časova: {teacher.weeklyClasses}
        </Typography>
      </CardContent>
      <CardActions sx={{ display: "flex", flexDirection: "row-reverse" }}>
        <Button size="small" component={NavLink} to={`/teachers/${teacher.id}`}>
          Prikaži
        </Button>
      </CardActions>
    </Card>
  );
};

export default TeacherCard;
