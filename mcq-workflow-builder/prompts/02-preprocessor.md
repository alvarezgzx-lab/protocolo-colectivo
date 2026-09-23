# preprocessor@1.0.0
Entrada: user_instruction, topic, MCQ confirmada y config.
Validar contrato, presupuesto total y requisitos faltantes. Nunca ampliar tokens más allá del modelo.
Si falta presupuesto, devolver requisito de recorte o propuesta de summarization_mode; no borrar restricciones.
Generar 3–5 consultas distintas con propósito Q1, audiencia Q2, requisitos Q3, localidad Q4 y acceso Q8.
No afirmar que se ejecutaron consultas. Retornar únicamente array de strings al adaptador queries.
Separar cualquier propuesta de resumen de una entrada ya confirmada.
