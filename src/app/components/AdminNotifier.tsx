"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const messages: Record<string, string> = {
  "evento-guardado": "Evento creado exitosamente.",
  "evento-actualizado": "Evento actualizado exitosamente.",
  guardada: "Noticia creada exitosamente.",
  guardado: "Producto creado exitosamente.",
  eliminado: "Producto eliminado.",
};

export function AdminNotifier() {
  const pathname = usePathname();
  const params = useSearchParams();
  const message = params.get("mensaje");
  useEffect(() => {
    if (message && messages[message]) toast.success(messages[message]);
  }, [message, pathname]);
  return null;
}
