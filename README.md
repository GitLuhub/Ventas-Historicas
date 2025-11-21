# Documentación: Cálculo de Ventas Históricas

## Descripción General
El script `totalVentasHistóricas.js` tiene como objetivo calcular el valor total de las ventas ganadas asociadas a una cuenta específica (Cliente) y actualizar este valor en su ficha correspondiente dentro de Zoho CRM.

Este proceso es fundamental para métricas como el **Valor de Vida del Cliente (CLV)**, permitiendo segmentar cuentas basadas en su facturación histórica real.

## Explicación Detallada Paso a Paso

### 1. Validación Inicial
El script comienza verificando que el `id_cuenta` proporcionado como entrada no sea nulo. Esta es una medida de seguridad crítica. Si no se proporciona un ID válido, la ejecución se detiene inmediatamente. Esto previene errores innecesarios al intentar consultar la API de CRM con un identificador vacío.

### 2. Obtención de Datos Relacionados
Una vez validado el ID, el script utiliza la función `zoho.crm.getRelatedRecords` para conectar con la base de datos de Zoho. Específicamente, solicita todos los registros del módulo **Deals** (Tratos) que están asociados a la cuenta especificada.
- **Módulo Origen**: Accounts (Cuentas)
- **Módulo Relacionado**: Deals (Tratos)
- **Clave de Relación**: El `id_cuenta` actúa como la llave foránea que vincula ambos módulos.

### 3. Inicialización de Variables
Antes de procesar los datos, se inicializa una variable acumuladora llamada `total_acumulado` con un valor de `0.0`. Esta variable servirá para sumar los importes de las ventas exitosas.

### 4. Procesamiento y Filtrado (Bucle)
El script entra en un bucle que recorre cada uno de los tratos recuperados en el paso anterior. Para cada trato, realiza las siguientes acciones:
1.  **Obtener Estado**: Lee el campo `Stage` (Fase) del trato.
2.  **Obtener Importe**: Lee el campo `Amount` (Importe). Si este campo está vacío (null), lo convierte automáticamente a `0.0` para evitar errores matemáticos en la suma.
3.  **Verificación de Éxito**: Evalúa si la fase del trato corresponde a una venta ganada. Comprueba si el estado es exactamente **"Closed Won"** o **"Cerrado Ganado"**.
4.  **Acumulación**: Si la condición anterior se cumple, suma el importe del trato a la variable `total_acumulado`. Si el trato no está ganado (por ejemplo, está perdido o en negociación), se ignora y no suma nada.

### 5. Actualización del Registro (Persistencia)
Una vez que se han revisado todos los tratos y se tiene la suma total de las ventas ganadas:
1.  Se crea un mapa de datos (`mapa_cuenta`) que contiene el par clave-valor del campo a actualizar.
2.  Se asigna el valor de `total_acumulado` al campo `Total_Ventas_Hist_ricas`.
3.  Se ejecuta la función `zoho.crm.updateRecord` apuntando al módulo **Accounts** y al ID de la cuenta específica, enviando el mapa con el nuevo valor.

### 6. Registro de Logs
Finalmente, el script imprime un mensaje de información (`info`) en los logs del sistema con el nuevo valor total calculado. Esto es útil para depuración y seguimiento de la ejecución del script.
