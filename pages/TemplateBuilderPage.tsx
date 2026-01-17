import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TemplateBuilder } from '../components/TemplateBuilder';

export const TemplateBuilderPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <TemplateBuilder
            onBack={() => navigate('/templates')}
            onSave={() => {
                alert("Template Saved!");
                navigate('/templates');
            }}
        />
    );
};
