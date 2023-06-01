import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";

const gradeString = new Map([
  [1, "prvi"],
  [2, "drugi"],
  [3, "treći"],
  [4, "četvrti"],
  [5, "peti"],
  [6, "šesti"],
  [7, "sedmi"],
  [8, "osmi"],
]);

const sufix = (n) => {
    let lastDigit = n.toString().slice(-1);
    return lastDigit === '1' ? '/ca' : 'a/ce'; 
}

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
        subheader={`Za ${gradeString.get(subject.grade)} razred.`}
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
        <Button>Prikaži</Button>
      </CardActions>
    </Card>
  );
};

export default SubjectCard;
