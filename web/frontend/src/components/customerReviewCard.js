import styles from "../styles/Reviews.module.css";
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

export default function CustomerReviewCard({image, review, numsReviews}) {
  return (   
    <div id="card" className={styles.card}>
        <div className={styles.cardHeader}>
            <img
            src={image}
            alt="Customer Review image"
            width={400}
            height={400}
            loading="lazy"
            />
            <div id="cardHeaderInfo" className={styles.cardHeaderInfo}>
                <p>Customer name</p>
                <p style={{fontSize: "small", color: "#c3c3c3"}}>{numsReviews} reviews</p>
            </div>
        </div>
        <div id="cardRating" className={styles.cardRating}>
            <Stack spacing={1}>
                <Rating name="half-rating" readOnly defaultValue={2.5} precision={0.5} />
            </Stack>
            <p style={{marginTop: "0px", marginLeft: "7px", color: "#c3c3c3"}}>7 months ago</p>
        </div>
        <div id="cardBody" className={styles.cardBody}>
            <p>{review}</p>
        </div>

    </div>
  );
}