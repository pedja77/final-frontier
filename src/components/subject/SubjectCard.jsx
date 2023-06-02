import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import { gradeToString, sufix } from "../../utils/textTools";
import { Link } from "react-router-dom";





const SubjectCard = ({ subject }) => {
  return (
    <Card
      sx={{
        minWidth: 250,
        paddingX: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      <CardHeader
        title={subject.subjectName}
        subheader={`Za ${gradeToString.get(subject.grade)} razred.`}
        sx={{backgroundColor: ''}}
      />
      <CardContent>
        <Typography>
          Ovaj predmet trenutno predaje {subject.teachers.length}{' '}
          nastavnik{sufix(subject.teachers.length)}.
        </Typography>
        <Typography>
            Trenutno ga sluša {subject.students.length} učenik{sufix(subject.students.length)}.
        </Typography>
      </CardContent>
      <CardActions sx={{display: 'flex', flexDirection: 'row-reverse'}}>
        <Button component={Link} to={`/subjects/${subject.id}`}>Prikaži</Button>
      </CardActions>
    </Card>
  );
};

export default SubjectCard;
