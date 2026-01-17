import React from 'react';
import { useNavigate } from 'react-router-dom';
import { JournalEditor } from '../components/JournalEditor';

interface EditorPageProps {
    onSave: (title: string, content: string) => void;
}

export const EditorPage: React.FC<EditorPageProps> = ({ onSave }) => {
    const navigate = useNavigate();

    return (
        <JournalEditor
            onBack={() => navigate('/')}
            onSave={(title, content) => {
                onSave(title, content);
                navigate('/');
            }}
        />
    );
};
