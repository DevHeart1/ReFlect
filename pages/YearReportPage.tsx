import React from 'react';
import { YearReport } from '../components/YearReport';

import { MoodCheckin } from '../utils/storage';

interface YearReportPageProps {
    moods: MoodCheckin[];
}

export const YearReportPage: React.FC<YearReportPageProps> = ({ moods }) => {
    return <YearReport moods={moods} />;
};
