import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { TextSecondary } from "@/components/ui/Typography";
import { Grid } from "@/components/ui/Layouts"; 

interface ModalConfirmacionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export function ModalConfirmacion({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message 
}: ModalConfirmacionProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="mb-6">
        <TextSecondary>{message}</TextSecondary>
      </div>
      
      <Grid className="grid-cols-2 mt-0"> 
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Eliminar
        </Button>
      </Grid>
    </Modal>
  );
}