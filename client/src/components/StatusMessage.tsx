import React from 'react';

interface Props {
  type: 'success' | 'error' | 'info';
  message: string;
}

const StatusMessage: React.FC<Props> = ({ type, message }) => {
  const bgColor = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700'
  }[type];

  return (
    <div className={`border-l-4 p-4 ${bgColor}`} role="alert">
      <p className="font-bold">{type.charAt(0).toUpperCase() + type.slice(1)}</p>
      <p>{message}</p>
    </div>
  );
};

export default StatusMessage;