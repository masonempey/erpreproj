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

const rowsSpend = [
    createData('10$ Coupon', { points: 100, icon: Icons.coins }),
    createData('Free Beard Trim', { points: 120, icon: Icons.coins }),
    createData('Free Haircut', { points: 200, icon: Icons.coins }),
    createData('Free Hair Products', { points: 150, icon: Icons.coins }),
];
export default function SpendTable() {
    return (
        <div style={{display: "flex", width:"50rem", gap: "10px"}}>
            <TableContainer 
            component={Paper} 
            sx={{ flexGrow: 0, flexShrink: 1, flexBasis: "50rem", marginLeft: "auto" }}
            >
            <Table aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Reward</TableCell>
                    <TableCell align="right">Coins Redeem</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {rowsSpend.map((row) => (
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
  