"use client";

type ConfirmDeleteFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  label?: string;
  message: string;
};

export function ConfirmDeleteForm({ action, id, label = "Borrar", message }: ConfirmDeleteFormProps) {
  return (
    <form action={action} onSubmit={(event) => { if (!window.confirm(message)) event.preventDefault(); }}>
      <input type="hidden" name="id" value={id} />
      <button className="text-sm text-red-700 underline underline-offset-2" type="submit">{label}</button>
    </form>
  );
}
