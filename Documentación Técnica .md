# Documentación Técnica: Cálculo de Ventas Históricas

## Arquitectura del Script
El script actúa como un proceso de backend dentro de Zoho CRM (Deluge), diseñado para ejecutarse de manera asíncrona o activada por eventos (Workflows/Schedules). Su función principal es agregar datos financieros de registros hijos (Tratos) hacia un registro padre (Cuenta).

### Componentes Clave
1.  **Trigger**: Evento que dispara la ejecución (ej. cierre de un trato o actualización programada).
2.  **API Client**: `zoho.crm` namespace para interactuar con la base de datos.
3.  **Lógica de Negocio**: Filtrado de estados y aritmética simple.
4.  **Persistencia**: Escritura del resultado en el campo personalizado de la Cuenta.

### Diagrama de Arquitectura
El siguiente esquema muestra la interacción entre los componentes del sistema:

```mermaid
graph LR
    Event((Evento/Trigger)) -->|Ejecuta| Script{Deluge Script}
    Script -->|1. getRelatedRecords| CRM[(Zoho CRM DB)]
    CRM -->|2. Retorna Tratos| Script
    Script -->|3. Procesa Datos| Script
    Script -->|4. updateRecord| CRM
```

## Diagrama de Flujo
El siguiente diagrama ilustra la lógica de decisión y el flujo de datos del script.

```mermaid
graph TD
    Start([Inicio]) --> ValidateID{¿ID Cuenta válido?}
    
    ValidateID -- No --> End([Fin])
    ValidateID -- Sí --> GetDeals[Obtener Tratos Relacionados]
    
    GetDeals --> InitSum[Inicializar Acumulador = 0]
    InitSum --> LoopDeals{¿Hay más tratos?}
    
    LoopDeals -- No --> UpdateAccount[Actualizar Cuenta]
    UpdateAccount --> LogInfo[Log: Nuevo Total]
    LogInfo --> End
    
    LoopDeals -- Sí --> GetStage[Obtener Fase e Importe]
    GetStage --> CheckWon{¿Es Ganado?}
    
    CheckWon -- No --> LoopDeals
    CheckWon -- Sí --> SumAmount[Acumular Importe]
    SumAmount --> LoopDeals
```

## Especificaciones Técnicas

### Entradas (Inputs)
| Variable | Tipo | Descripción | Requerido |
| :--- | :--- | :--- | :--- |
| `id_cuenta` | `BigInt` / `String` | ID único del registro en el módulo **Accounts**. | Sí |

### Salidas (Outputs)
| Acción | Descripción |
| :--- | :--- |
| **Actualización de Registro** | Modifica el campo `Total_Ventas_Hist_ricas` en el módulo **Accounts**. |
| **Logs del Sistema** | Imprime el valor final calculado mediante `info`. |

## Dependencias del Esquema
| Módulo | Campo (API Name) | Tipo de Dato | Uso |
| :--- | :--- | :--- | :--- |
| **Accounts** | `Total_Ventas_Hist_ricas` | Currency / Decimal | Campo destino para el valor calculado. |
| **Deals** | `Stage` | Picklist | Criterio de filtrado (Ganado vs Perdido). |
| **Deals** | `Amount` | Currency | Valor a sumar. |
