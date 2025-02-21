import React from 'react';
import PropTypes from 'prop-types';
import styles from 'styles/PointsDisplay.module.css';

const PointsDisplay = ({ points }) => (
  <div className={styles.pointsContainer}>
    <h2>
      Points:
      <span>{points}</span>
    </h2>
  </div>
);

PointsDisplay.propTypes = {
  points: PropTypes.number.isRequired,
};

export default PointsDisplay;
