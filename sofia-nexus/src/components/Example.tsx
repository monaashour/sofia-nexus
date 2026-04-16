import React from 'react';

interface ExampleProps {
    title: string;
    description?: string;
}

const Example: React.FC<ExampleProps> = ({ title, description }) => {
    return (
        <div className="example-component">
            <h1 className="text-2xl font-bold">{title}</h1>
            {description && <p className="text-lg">{description}</p>}
        </div>
    );
};

export default Example;