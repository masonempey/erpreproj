import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Image from "next/image";

function createData(name, data) {
  return { name,data };
}
const Icons = {
    coins: "/images/hairstyle.png",
};
const rowsEarned = [
    createData('Booking an appointment', { points: 10, icon: Icons.coins }),
    createData('Checking in on time', { points: 10, icon: Icons.coins }),
    createData('Spend over 60$', { points: 40, icon: Icons.coins }),
    createData('Leaving a review', { points: 30, icon: Icons.coins }),
];
export default function EarnTable() {
    return (
        <div style={{display: "flex", width:"25rem", gap: "10px"}}>
            <TableContainer 
            component={Paper} 
            sx={{ flexGrow: 0, flexShrink: 1, flexBasis: "50rem", marginLeft: "auto" }}
            >
            <Table aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Actions</TableCell>
                    <TableCell align="right">Earned Coins</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {rowsEarned.map((row) => (
                        <TableRow key={row.name}>
                        <TableCell component="th" scope="row">{row.name}</TableCell>
                        <TableCell align="right">
                            {row.data.points} 
                            <Image 
                            src={row.data.icon} 
                            width={20} 
                            height={20} 
                            alt="Coin Icon"
                            style={{ marginLeft: "10px" }}
                            />
                        </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </TableContainer>
        </div>
    );
  }
  