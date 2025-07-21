import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";

export default function QRScanner({ onScan, onClose, isActive }) {
  const scannerRef = useRef(null);
  const [scanner, setScanner] = useState(null);

  useEffect(() => {
    if (isActive && !scanner) {
      const html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true,
          },
          videoConstraints: {
            facingMode: "environment",
          },
        },
        false
      );

      html5QrcodeScanner.render(
        (decodedText) => {
          try {
            const qrData = JSON.parse(decodedText);
            onScan(qrData);
          } catch (error) {
            onScan({ type: "unknown", data: decodedText });
          }
        },
        (error) => {
          // silent
        }
      );

      setScanner(html5QrcodeScanner);
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(console.error);
        setScanner(null);
      }
    };
  }, [isActive, onScan, scanner]);

  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, [scanner]);

  if (!isActive) return null;

  return (
    <div className="scan-overlay fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center px-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Scan QR Code</h2>
        <p className="text-gray-300">Position the QR code within the frame</p>
      </div>

      <div className="relative w-full max-w-xs aspect-square overflow-hidden">
        {/* Actual camera feed */}
        <div
          id="qr-reader"
          className="absolute top-0 left-0 w-full h-full z-0 rounded-lg"
        />

        {/* Overlay frame */}
        <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
          <div className="scan-area w-full h-full relative">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-500"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-500"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-500"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-500"></div>
            <div className="scan-line absolute top-1/2 left-0 w-full h-0.5 bg-emerald-400 animate-pulse"></div>
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="mt-6 px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
      >
        Cancel
      </button>
    </div>
  );
}
