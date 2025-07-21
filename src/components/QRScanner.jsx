import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

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
          supportedScanTypes: [Html5QrcodeScanner.SCAN_TYPE_CAMERA],
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true,
          },
          videoConstraints: {
            facingMode: "environment", // ✅ Use back camera
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
          // Silent error handling
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
    <div className="scan-overlay">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Scan QR Code</h2>
        <p className="text-gray-300">Position the QR code within the frame</p>
      </div>

      <div className="scan-area">
        <div className="scan-corners"></div>
        <div className="scan-corners"></div>
        <div className="scan-corners"></div>
        <div className="scan-corners"></div>
        <div className="scan-line"></div>

        <div id="qr-reader" className="w-full h-full"></div>
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
