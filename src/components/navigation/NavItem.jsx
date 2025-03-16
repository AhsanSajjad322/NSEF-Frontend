import React from 'react';

export const NavItem = ({ label }) => {
    return (
        <div className="py-2 px-4 rounded-md hover:bg-primary-100 text-text-DEFAULT cursor-pointer">
            {label}
        </div>
    );
};