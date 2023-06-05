import { Delete, Edit } from "@mui/icons-material";
import { FormLabel, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
import { Box } from "@mui/system"

/**props are {tableLabel: String, tableHeaders: [String], tableData:[{}], tdConfig:[String]}, functions */
const TableTemplate = ({props}) => {

    /*
        tableLabel, tableHeaders[], tableData[], tdConfig[]
    */

    return <Box>
        <FormLabel>{props.tableLabel}:</FormLabel>
            <TableContainer>
              <Table
                sx={{ minWidth: "80%" }}
                size="small"
                aria-label={props.tableLabel}
              >
                <TableHead>
                  <TableRow>
                    {props.tableHeaders.map((th, i) => <TableCell key={i}>{th}</TableCell>)} {/*crypto je "eksternalizovan" */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.tableData.map((t) => (
                    <TableRow key={t[props.tdConfig[0]]}>
                      {props.tdConfig.map(e => <TableCell key={t[e]}>{t[e]}</TableCell>)}
                      <TableCell align="right">
                        <Tooltip title="Obriši">
                          <IconButton
                            onClick={(e) => props.removeFn(e, t, props.collectionName)}
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
    </Box>
}

export default TableTemplate;
