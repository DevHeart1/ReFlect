import React from 'react';
import { DailyMoodTracker } from '../components/DailyMoodTracker';

import { MoodCheckin } from '../utils/storage';

interface MoodTrackerPageProps {
    moods: MoodCheckin[];
}

export const MoodTrackerPage: React.FC<MoodTrackerPageProps> = ({ moods }) => {
    return <DailyMoodTracker moods={moods} />;
};
