import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';

interface Props {
  instanceInfo: {
    kioskId: string;
    instanceId: string;
    thumbmarkId: string;
    startTime: Date;
  };
}

export function InstanceOverlay({ instanceInfo }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [uptime, setUptime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - instanceInfo.startTime.getTime();
      
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      
      setUptime(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [instanceInfo.startTime]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors"
      >
        <Info className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Instance Information</h2>
            <dl className="space-y-2">
              <div>
                <dt className="font-semibold">Kiosk ID:</dt>
                <dd className="ml-2">{instanceInfo.kioskId}</dd>
              </div>
              <div>
                <dt className="font-semibold">Instance ID:</dt>
                <dd className="ml-2 break-all">{instanceInfo.instanceId}</dd>
              </div>
              <div>
                <dt className="font-semibold">Device ID:</dt>
                <dd className="ml-2 break-all">{instanceInfo.thumbmarkId}</dd>
              </div>
              <div>
                <dt className="font-semibold">Start Time:</dt>
                <dd className="ml-2">{instanceInfo.startTime.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="font-semibold">Uptime:</dt>
                <dd className="ml-2">{uptime}</dd>
              </div>
            </dl>
            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}