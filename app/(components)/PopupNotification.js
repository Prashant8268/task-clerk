'use client'
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const PopupNotification = ({ message, duration = 3000 }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => {
        setIsVisible(false);
    };

    return (
        <>
            {isVisible && (
                <div className="notification-container">
                    <div className="notification">
                        <span>{message}</span>
                        <button onClick={handleClose}>&times;</button>
                    </div>
                </div>
            )}
        </>
    );
};

PopupNotification.propTypes = {
    message: PropTypes.string.isRequired,
    duration: PropTypes.number,
};

export default PopupNotification;
