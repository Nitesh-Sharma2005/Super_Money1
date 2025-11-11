// Fix: Import React to use React.ReactNode type.
import React from 'react';

// Add type definition for BarcodeDetector API for QR code scanning
declare global {
  interface Window {
    BarcodeDetector: new (options?: { formats: string[] }) => BarcodeDetector;
  }
  interface BarcodeDetector {
    detect(image: ImageBitmapSource): Promise<DetectedBarcode[]>;
  }
  interface DetectedBarcode {
    boundingBox: DOMRectReadOnly;
    rawValue: string;
    format: string;
    cornerPoints: { x: number, y: number }[];
  }
}

export enum NavTab {
  Home = 'Home',
  Pay = 'Pay',
  Profile = 'Profile',
}

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  gradient: string;
}

export interface SmallCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

export interface PayeeInfo {
  name: string;
  upiId: string;
}

export interface Transaction {
  id: string;
  payee: PayeeInfo;
  amount: number;
  timestamp: Date;
  cashbackPercentage: number;
}

export interface UpiContact {
  id: string; // UPI ID serves as the unique identifier
  upiId: string;
  name: string;
}
