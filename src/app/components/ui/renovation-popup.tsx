"use client";

import { useState, useEffect } from "react";
import { Wrench, Hammer, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";

interface RenovationPopupProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function RenovationPopup({ isOpen, onClose }: RenovationPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  // Es un aviso: debe permitir interactuar con el resto de la página.
  return (
    <Dialog modal={false} open={isVisible} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 bg-[#0051A2] text-white border-2 border-[#FF46A2] shadow-2xl">
        <div className="relative">
          <div className="p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-[#99CC33]/20 rounded-full flex items-center justify-center">
                <Wrench className="w-10 h-10 text-[#99CC33]" />
              </div>
              <div className="flex justify-center gap-2 mb-4">
                <Hammer className="w-6 h-6 text-[#FF46A2]" />
                <Hammer className="w-6 h-6 text-[#FF46A2] rotate-90" />
              </div>
            </div>

            <DialogHeader className="text-center mb-6">
              <DialogTitle className="text-2xl font-bold text-[#99CC33] mb-2">
                Pagina en remodelación
              </DialogTitle>
              <DialogDescription className="text-white/90 text-base leading-relaxed">
                disculpa las molestas
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/20">
              <div className="flex items-center justify-center gap-2 text-sm text-white/80">
                <AlertCircle className="w-4 h-4" />
                <span>Estamos mejorando nuestros servicios</span>
              </div>
            </div>

            <div className="mt-6 text-xs text-white/60">
              Vuelve pronto para disfrutar de una experiencia mejorada
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
