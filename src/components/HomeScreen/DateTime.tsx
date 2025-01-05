import React from 'react';
import { useDateTime } from '../../hooks/useDateTime';

export function DateTime() {
  const { time, date } = useDateTime();

  return (
    <div className="flex flex-col items-end">
      <h1 className="text-[140px] font-[100] leading-[0.9] mb-4 text-[#AD9E6E]">
        {time}
      </h1>
      <p className="text-[24px] text-gray-600 font-light pr-2">
        {date}
      </p>
    </div>
  );
}