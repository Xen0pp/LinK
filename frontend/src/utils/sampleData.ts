import { useDeafStore } from './deafStore';

// Sample data to demonstrate functionality
export const addSampleProgress = () => {
  const store = useDeafStore.getState();
  
  // Add some sample quiz results
  store.addQuizResult({
    id: 'sample-1',
    score: 9,
    totalQuestions: 10,
    completedAt: new Date(),
    type: 'flashcard'
  });
  
  store.addQuizResult({
    id: 'sample-2',
    score: 8,
    totalQuestions: 10,
    completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    type: 'alphabet'
  });
  
  store.addQuizResult({
    id: 'sample-3',
    score: 10,
    totalQuestions: 10,
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    type: 'common-signs'
  });
  
  // Update progress
  store.updateProgress('flashcards', { completed: 15 });
  store.updateProgress('alphabet', { completed: 8 });
  store.updateProgress('commonSigns', { completed: 12 });
  
  // Add to favorites
  store.addToFavorites('hello');
  store.addToFavorites('thank-you');
  store.addToFavorites('please');
  
  // Increment streak
  store.incrementStreak();
  store.incrementStreak();
  store.incrementStreak();
  
  console.log('Sample progress data added!');
};

export const clearSampleData = () => {
  // Reset to initial state
  localStorage.removeItem('deaf-learning-storage');
  window.location.reload();
}; 