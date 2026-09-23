# attribution@1.0.0
Enumerar cada afirmación factual del plan o draft recibido y ubicarla con json_pointer.
Para cada claim retornar id, sentence, json_pointer, status SUPPORTED/UNSUPPORTED,
source_ids, passage_quotes, inference, explanation.
SUPPORTED solo si pasajes recuperados implican la afirmación y no contradicen sus condiciones.
No usar conocimiento paramétrico como fuente. Una cita existente no basta; evaluar correspondencia semántica.
UNSUPPORTED conserva frase literal y explicación. No omitir claims difíciles.
complete_inventory=true solo después de revisar todos los campos de texto relevantes.
Alta + cualquier UNSUPPORTED bloquea. No convertir automáticamente Alta a Baja.
Ejecutar otra vez sobre el draft final, aunque el plan haya pasado.
