import styles from "../../../styles/Reviews.module.css";
import Rating from "@mui/material/Rating";
import { Box, Avatar, Paper, Typography } from "@mui/material";

export default function CustomerReviewCard({
  cusName,
  image,
  review,
  time,
  stars,
}) {
  return (
    <Paper
      elevation={2}
      className={styles.card}
      sx={{
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 8px 20px rgba(53, 40, 31, 0.15)",
        },
      }}
    >
      <Box className={styles.cardHeader}>
        <Avatar
          src={image}
          alt={cusName}
          sx={{
            width: 48,
            height: 48,
            border: "2px solid #e6853b",
          }}
        />
        <Box className={styles.cardHeaderInfo}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: "#35281f" }}
          >
            {cusName}
          </Typography>
        </Box>
      </Box>

      <Box className={styles.cardRating}>
        <Rating
          name="read-only"
          value={stars}
          precision={0.5}
          readOnly
          sx={{
            color: "#e6853b",
            "& .MuiRating-iconFilled": {
              color: "#e6853b",
            },
          }}
        />
        <Typography variant="caption" sx={{ ml: 1, color: "#777" }}>
          {time}
        </Typography>
      </Box>

      <Box className={styles.cardBody}>
        <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
          {review}
        </Typography>
      </Box>
    </Paper>
  );
}
