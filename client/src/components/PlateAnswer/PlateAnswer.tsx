import React, { useState, useEffect } from 'react';
import * as classes from './PlateAnswer.module.scss';
import formatPlate from './helpers/formatPlate';

interface PlateAnswerProps {
  className?: string;
  answer: { 
    plate: string;
    region: string;
  };
}

const PlateAnswer: React.FC<PlateAnswerProps> = ({ className, answer: { plate, region } }) => {
  const [copyFeedback, setFeedback] = useState<string>('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(null);

  const answerClassName = `${classes.plate} ${className || ''}`;
  const formattedPlate = formatPlate(plate, region);

  // Когда появляется фидбэк, через 3 секунды его сбрасываем
  useEffect(() => {
    if (copyFeedback) {
      const timer = setTimeout(() => {
        setFeedback('');
        setFeedbackType(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [copyFeedback]);

  // Копирование номера в буфер обмена
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedPlate);
      setFeedback('Скопировано');
      setFeedbackType('success');
    } catch (error) {
      setFeedback('Ошибка при копировании');
      setFeedbackType('error');
      console.error(error);
    }
  };

  return (
    <div className={classes['plate-container']}>
      <div 
        className={answerClassName} 
        onClick={handleCopy}
        style={{ cursor: 'pointer' }}
      >
        {formattedPlate}
      </div>
      {copyFeedback && (
        <span 
          className={`${classes.feedback} ${
            feedbackType === 'success' ? classes['feedback--success'] : classes['feedback--error']
          }`}
        >
          {copyFeedback}
        </span>
      )}
    </div>
  );
}

export default PlateAnswer;
