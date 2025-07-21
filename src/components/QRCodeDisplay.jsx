import React from "react";
import QRCode from "qrcode.react";

export default function QRCodeDisplay({ value, size = 200, title }) {
  return (
    <div className="text-center">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <div className="inline-block p-4 bg-white rounded-lg shadow-lg">
        <QRCode
          value={typeof value === "string" ? value : JSON.stringify(value)}
          size={size}
          level="H"
          includeMargin
        />
      </div>
    </div>
  );
}
