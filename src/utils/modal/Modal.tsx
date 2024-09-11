import React, { useState } from 'react';
import styles from './Modal.module.css';
import { useAppDispatch } from '../../app/hooks';
import { addRate } from '../../features/classbook/classbook.slice';

interface IProps {
    isOpen: boolean;
    onClose: () => void;
    studentId: number | null;
    lessonId: number | null;
    onSave: (studentId: number, lessonId: number, rating: number) => void;
}

export const Modal: React.FC<IProps> = ({ isOpen, onClose, studentId, lessonId, onSave }) => {
    const [rating, setRating] = useState<number | ''>('');
    const [error, setError] = useState<string>('');
    const dispatch = useAppDispatch();

    const getGradeLevel = (rating: number): string => {
        if (rating <= 3) return "անբավարար";
        if (rating <= 5) return "բավարար";
        if (rating <= 7) return "լավ";
        return "գերազանց";
    };

    const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numericValue = Number(value);
        if (isNaN(numericValue) || numericValue < 0 || numericValue > 10) {
            setError("Please enter a valid number between 0 and 10");
        } else {
            setError('');
            setRating(numericValue);
        }
    };

    const handleSave = () => {
        if (studentId !== null && lessonId !== null && typeof rating === 'number') {
            dispatch(addRate({ studentId, lessonId, rating }));
            setRating('');
            onClose(); 
        };
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3>Enter Rating</h3>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <input
                    type="number"
                    value={rating}
                    onChange={handleRatingChange}
                    placeholder="Enter rating (0-10)"
                    min={0}
                    max={10}
                />
                {typeof rating === 'number' && !error && (
                    <p>Grade: {getGradeLevel(rating)}</p>
                )}
                <button onClick={handleSave} disabled={!!error || rating === ''}>
                    Save
                </button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};
