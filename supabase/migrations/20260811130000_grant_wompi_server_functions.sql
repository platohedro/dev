-- The payment API calls these SECURITY DEFINER functions with the
-- service_role client. Keep them unavailable to public/anonymous clients,
-- but explicitly allow the server role to execute them.

grant execute on function public.create_wompi_order(
  text, public.order_kind, integer, text, text, jsonb
) to service_role;

grant execute on function public.finalize_wompi_order(
  text, text, text, text, integer, text, timestamptz
) to service_role;

notify pgrst, 'reload schema';
