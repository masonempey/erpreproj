// This code is taken from https://www.reactbits.dev/components/tilted-card and modified by GPT4o to fit the project.

import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import PropTypes from 'prop-types';
import styles from '../styles/TiltedCard.module.css';

const TiltedCard = ({
  imageSrc,
  altText,
  captionText,
  containerHeight,
  containerWidth,
  imageHeight,
  imageWidth,
  rotateAmplitude,
  scaleOnHover,
  showMobileWarning,
  showTooltip,
  displayOverlayContent,
  overlayContent,
}) => {
  const ref = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const scale = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacity = useMotionValue(0);
  const rotateFigcaption = useMotionValue(0);

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const xPos = clientX - left;
    const yPos = clientY - top;
    const xMid = width / 2;
    const yMid = height / 2;
    const rotateXValue = ((yPos - yMid) / yMid) * rotateAmplitude;
    const rotateYValue = ((xPos - xMid) / xMid) * -rotateAmplitude;

    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);
    x.set(xPos - xMid);
    y.set(yPos - yMid);
    opacity.set(1);
    rotateFigcaption.set(rotateYValue);
  };

  const handleMouseEnter = () => {
    scale.set(scaleOnHover);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    x.set(0);
    y.set(0);
    opacity.set(0);
    rotateFigcaption.set(0);
  };

  return (
    <figure
      ref={ref}
      className={styles.tiltedCardFigure}
      style={{
        height: containerHeight,
        width: containerWidth,
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showMobileWarning && (
        <div className={styles.tiltedCardMobileAlert}>
          This effect is not optimized for mobile. Check on desktop.
        </div>
      )}

      <motion.div
        className={styles.tiltedCardInner}
        style={{
          width: imageWidth,
          height: imageHeight,
          rotateX,
          rotateY,
          scale,
        }}
      >
        <motion.img
          src={imageSrc}
          alt={altText}
          className={styles.tiltedCardImg}
          style={{
            width: imageWidth,
            height: imageHeight,
          }}
        />

        {displayOverlayContent && overlayContent && (
          <motion.div className={styles.tiltedCardOverlay}>
            {overlayContent}
          </motion.div>
        )}
      </motion.div>

      {showTooltip && (
        <motion.figcaption
          className={styles.tiltedCardCaption}
          style={{
            x,
            y,
            opacity,
            rotate: rotateFigcaption,
          }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  );
};

TiltedCard.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  altText: PropTypes.string.isRequired,
  captionText: PropTypes.string,
  containerHeight: PropTypes.string,
  containerWidth: PropTypes.string,
  imageHeight: PropTypes.string,
  imageWidth: PropTypes.string,
  rotateAmplitude: PropTypes.number,
  scaleOnHover: PropTypes.number,
  showMobileWarning: PropTypes.bool,
  showTooltip: PropTypes.bool,
  displayOverlayContent: PropTypes.bool,
  overlayContent: PropTypes.node,
};

TiltedCard.defaultProps = {
  captionText: '',
  containerHeight: '300px',
  containerWidth: '300px',
  imageHeight: '300px',
  imageWidth: '300px',
  rotateAmplitude: 12,
  scaleOnHover: 1.2,
  showMobileWarning: false,
  showTooltip: true,
  displayOverlayContent: false,
  overlayContent: null,
};

export default TiltedCard;