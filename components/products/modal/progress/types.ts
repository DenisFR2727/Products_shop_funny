export interface ProgressModalProps {
  open: boolean;
  children: React.ReactNode;
  overlayId: string;
}
export interface ComfirmationProgressProps {
  onCancel: () => void;
}
