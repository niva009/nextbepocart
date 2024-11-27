'use client';

import React from 'react';

interface FloatingWhatsAppButtonProps {
  phoneNumber: string; // WhatsApp phone number
  message: string; // Default message
}

const FloatingWhatsAppButton: React.FC<FloatingWhatsAppButtonProps> = ({
  phoneNumber,
  message,
}) => {
  // Construct the WhatsApp URL with the provided phone number and message
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <div className="fixed bottom-5 right-5 lg:bottom-10 lg:right-10 z-50">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        // className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition transform hover:scale-105 focus:outline-none"
        aria-label="Chat with us on WhatsApp"
      >
        {/* WhatsApp Icon SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="35"
          height="35"
          fill="green"
          viewBox="0 0 24 24"
        >
          <path d="M12.004 0C5.375 0 0 5.373 0 12c0 2.133.554 4.212 1.606 6.044L0 24l6.136-1.589C8.007 23.44 10.007 24 12.004 24 18.633 24 24 18.627 24 12S18.633 0 12.004 0zm0 21.885c-1.8 0-3.54-.473-5.095-1.37l-.364-.21-3.65.946.995-3.549-.237-.377C2.668 15.74 2.176 13.879 2.176 12c0-5.442 4.427-9.87 9.828-9.87 5.401 0 9.836 4.428 9.836 9.87 0 5.434-4.435 9.861-9.836 9.861zm5.498-7.348c-.301-.15-1.778-.871-2.055-.969-.276-.093-.478-.14-.68.14-.201.278-.78.968-.953 1.165-.174.195-.348.221-.65.072-.301-.15-1.27-.47-2.422-1.496-.897-.799-1.5-1.785-1.677-2.087-.175-.301-.019-.464.13-.612.134-.132.301-.348.452-.522.151-.175.201-.278.301-.478.1-.195.05-.365-.025-.514-.075-.15-.68-1.63-.93-2.234-.246-.592-.497-.513-.678-.513h-.58c-.2 0-.516.073-.787.365-.276.292-1.038 1.014-1.038 2.475 0 1.461 1.062 2.872 1.21 3.066.15.195 2.093 3.198 5.066 4.487.707.303 1.26.484 1.691.619.711.227 1.358.195 1.87.118.571-.085 1.778-.724 2.03-1.425.25-.703.25-1.307.175-1.425-.074-.118-.277-.195-.577-.346z" />
        </svg>
      </a>
    </div>
  );
};

export default FloatingWhatsAppButton;
