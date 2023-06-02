import { Typography } from "@mui/material"
import { useLoaderData } from "react-router-dom";

const Subject = () => {

    const subject = useLoaderData();
    console.log('subject ' + JSON.stringify(subject, null, 4))

    return <Typography variant="h2">{subject.subjectName}</Typography>
}

export default Subject;