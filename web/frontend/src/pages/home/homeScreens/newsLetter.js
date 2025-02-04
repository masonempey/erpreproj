import React from "react";
import newsletterStyles from "../../../styles/Products.module.css";

export default function NewsLetter() {
    const information = [
        {title: "20% Off Haircuts!", date: "Ends: February 20th 2025", description: "To celebrate our new app we are offering 25% off to anyone who makes an account and books an appointment!"},
        {title: "10% Product Discounts!", date: "Ends: February 25th 2025", description: "In shop products will be 10% off for the time being!"},
        {title: "Now Hiring!", description: "We are looking for new talent to come and join our team!"},
        {title: "New System!", description: "We are integrating a new website and discription, please contact us if you experiance any issue."},
        {title: "Shop closure!", date: "Closed: February 16th"},
        {title: "Family discounts!", description: "Book a bundle of appointments to recieve a discount."},
        {title: "Changing opening times!", date: "Starts: February 18th", description: "Shop  will be opening at 8 am instead of 9 am on saturadys."}
    ]
    return(
        <div>
            <h2 className={newsletterStyles.title}>Erpre Newsletter</h2>
            <div className={newsletterStyles.newsletterContainer}>
                {information.map((point, index) => (
                    <div key={index} className={newsletterStyles.card}>
                        <h3>{point.title}</h3>
                        {point.date && <p className={newsletterStyles.date}>{point.date}</p>}
                        <p>{point.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}