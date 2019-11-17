export function calculateStrength({ // eslint-disable-line import/prefer-default-export
  attempts = [],
}) {
  const recentAttempts = attempts.filter((attempt) => {
    const currentDate = Date.now();
    const currentTimestampInSeconds = currentDate / 1000;
    const timeDifferenceInSeconds = currentTimestampInSeconds - attempt.timestamp.seconds;
    const secondsToDaysRatio = 86400;
    const timeDifferenceInDays = timeDifferenceInSeconds / secondsToDaysRatio;
    if (timeDifferenceInDays > 30) {
      return false;
    }
    return true;
  });

  const totalAttempts = recentAttempts.length;

  const correctAttempts = recentAttempts.reduce((totalCorrectAttempts, attempt) => {
    if (attempt.correct) {
      return totalCorrectAttempts + 1;
    }
    return totalCorrectAttempts;
  }, 0);
  const attemtQualityCoefficient = correctAttempts / totalAttempts;

  const optimalAmountOfAttempts = 6;
  const attemptQuantityCoefficient = totalAttempts / optimalAmountOfAttempts;

  return attemtQualityCoefficient * attemptQuantityCoefficient;
}
