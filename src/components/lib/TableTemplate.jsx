import { Delete, Edit } from "@mui/icons-material";
import {
  FormLabel,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { Box } from "@mui/system";
import { getUserRole } from "../../utils/token";

/**props are {tableLabel: String, tableHeaders: [String], tableData:[{}], tdConfig:[String]}, functions */
const TableTemplate = ({ props }) => {
  /*
        tableLabel, tableHeaders[], tableData[], tdConfig[]
    */

  return (
    <>
      <FormLabel>{props.tableLabel}:</FormLabel>
      <TableContainer>
        <Table
          sx={{ minWidth: "50vh", maxWidth: "80vh" }}
          size="small"
          aria-label={props.tableLabel}
        >
          <TableHead>
            <TableRow>
              {/*crypto je "eksternalizovan", pisao window. ispred pa se vite vise ne zali */}
              {props.tableHeaders.map((th, i) => (
                <TableCell key={window.crypto.randomUUID()}>{th}</TableCell>
              ))}
              {getUserRole() === "ROLE_ADMIN" && <TableCell align="right">Akcija</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.tableData.map((t) => (
              <TableRow key={t[props.tdConfig[0]]}>
                {props.tdConfig.map((e) => (
                  <TableCell key={t[e]}>{t[e]}</TableCell>
                ))}
                {getUserRole() === "ROLE_ADMIN" && (
                  <TableCell align="right">
                    <Tooltip title="Obriši">
                      <IconButton
                        onClick={(e) =>
                          props.removeFn(e, t, props.collectionName)
                        }
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Izmeni">
                      <IconButton>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TableTemplate;
