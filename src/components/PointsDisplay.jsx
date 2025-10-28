import React from 'react';
import PropTypes from 'prop-types';
import { FaTrophy } from 'react-icons/fa';
import styles from 'styles/PointsDisplay.module.css';

const PointsDisplay = ({ points }) => (
  <div className={styles.pointsContainer}>
    <div className={styles.pointsContent}>
      <FaTrophy className={styles.icon} />
      <span className={styles.label}>Productivity Score:</span>
      <span className={styles.points}>{points}</span>
    </div>
  </div>
);

PointsDisplay.propTypes = {
  points: PropTypes.number.isRequired,
};

export default PointsDisplay;
