// 1. Validar ID de entrada
if(id_cuenta != null)
{
	// 2. Obtener todos los tratos asociados a esa cuenta
	// "Deals" es el nombre del módulo relacionado en Accounts
	lista_tratos = zoho.crm.getRelatedRecords("Deals", "Accounts", id_cuenta);
	
	total_acumulado = 0.0;
	
	// 3. Bucle: Recorrer cada trato y sumar si está ganado
	for each trato in lista_tratos
	{
		fase = trato.get("Stage");
		importe = ifnull(trato.get("Amount"), 0.0).toDecimal();
		
		// Solo sumamos si está ganado (ajusta el nombre de tu fase ganada)
		if(fase == "Closed Won" || fase == "Cerrado ganado")
		{
			total_acumulado = total_acumulado + importe;
		}
	}
	
	// 4. Actualizar la Ficha de la Empresa (Account)
	mapa_cuenta = Map();
	mapa_cuenta.put("Total_Ventas_Hist_ricas", total_acumulado); // Verifica tu nombre API
	
	resp = zoho.crm.updateRecord("Accounts", id_cuenta, mapa_cuenta);
	
	info "Nuevo total actualizado: " + total_acumulado;
}