declare module "react-qr-scanner" {
  import { ComponentType } from "react";

  interface QrScannerProps {
    delay?: number;
    onError?: (error: Error) => void;
    onScan?: (data: string | null) => void;
    style?: React.CSSProperties;
    constraints?: MediaTrackConstraints;
  }

  export const QrScanner: ComponentType<QrScannerProps>;
}
