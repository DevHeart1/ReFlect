import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TemplateBuilder } from '../components/TemplateBuilder';
import { Template } from '../types';

interface TemplateBuilderPageProps {
    onSaveNewTemplate: (template: Template) => void;
}

export const TemplateBuilderPage: React.FC<TemplateBuilderPageProps> = ({ onSaveNewTemplate }) => {
    const navigate = useNavigate();

    return (
        <TemplateBuilder
            onBack={() => navigate('/templates')}
            onSave={(template) => {
                onSaveNewTemplate(template);
                navigate('/templates');
            }}
        />
    );
};
