import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TemplatesView } from '../components/TemplatesView';
import { Template } from '../types';

interface TemplatesPageProps {
    templates: Template[];
    onAddTemplate: (template: Template) => void;
}

export const TemplatesPage: React.FC<TemplatesPageProps> = ({ templates, onAddTemplate }) => {
    const navigate = useNavigate();

    return <TemplatesView
        templates={templates}
        onAddTemplate={onAddTemplate}
        onCreateCustom={() => navigate('/templates/builder')}
    />;
};
