import { Button } from "./Button";
import { TitleSection, TextSecondary } from "./Typography";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export function ModalConfirmacion({ isOpen, onClose, onConfirm, title, message }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl animate-in fade-in zoom-in duration-200">
        <TitleSection>{title}</TitleSection>
        
        <div className="mb-6">
          <TextSecondary>{message}</TextSecondary>
        </div>
        
        {/* Botones nivelados con Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
}