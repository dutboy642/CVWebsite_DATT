import React, { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode; // Định nghĩa kiểu dữ liệu của children là ReactNode
}

const MainContent: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="layout">
            {children}
        </div>
    );
};

export default MainContent;