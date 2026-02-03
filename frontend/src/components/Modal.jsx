import React from 'react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = '500px' }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
        }}>
            <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '12px',
                width: '100%',
                maxWidth: maxWidth,
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{title}</h2>
                    <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;
