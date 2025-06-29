import QRCode from "react-qr-code";

type QRCodeGeneratorProps = {
  url: string;
  className?: string;
  [key: string]: any; // permite props dinâmicos
};

export default function QRCodeGenerator({
  url,
  className,
  ...props
}: QRCodeGeneratorProps) {
  return (
    <div className={`w-full flex items-center justify-center`}>
      <QRCode
        value={url}
        bgColor="#ffffff"
        fgColor="#000000"
        {...props}
        className={className}
      />
    </div>
  );
}
