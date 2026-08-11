"use client";
import { useTranslation } from "react-i18next";
import { useCart } from "./CartProvider";
import { toast } from "sonner";
export function ProductBuyButton({ productId, name, priceCop, imageUrl, disabled }: { productId: string; name: string; priceCop: number; imageUrl: string | null; disabled: boolean }) {
  const { t } = useTranslation();
  const { add } = useCart();
  return <button disabled={disabled} onClick={() => {
    add({ productId, name, priceCop, imageUrl });
    toast.success("Producto agregado al carrito", { description: "Puedes continuar comprando o revisar tu carrito." });
  }} className="mt-5 bg-[#99CC33] px-4 py-3 font-bold text-[#003d7a] disabled:opacity-50">{disabled ? t("productBuyButton.soldOut") : "Agregar al carrito"}</button>;
}
