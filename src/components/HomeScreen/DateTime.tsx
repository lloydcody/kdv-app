import React from 'react';
import { useDateTime } from '../../hooks/useDateTime';

export function DateTime() {
  const { time, date } = useDateTime();

  return (
    <div className="mb-6">
      <h1 className="text-[96px] font-light text-gray-900 leading-none">
        {time}
      </h1>
      <p className="text-2xl text-gray-600">
        {date}
      </p>
    </div>
  );
}