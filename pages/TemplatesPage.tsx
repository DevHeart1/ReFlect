import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TemplatesView } from '../components/TemplatesView';

export const TemplatesPage: React.FC = () => {
    const navigate = useNavigate();

    return <TemplatesView onCreateCustom={() => navigate('/templates/builder')} />;
};
