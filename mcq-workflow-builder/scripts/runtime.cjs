"use strict";
/* Runtime de referencia sin dependencias. No contiene conectores ni evidencia fabricada. */
const canonical = x => JSON.stringify(x, (_, v) => v && typeof v === "object" && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const clone = x => JSON.parse(JSON.stringify(x));
class GateError extends Error { constructor(gate, reason) { super(reason); this.gate = gate; } }
function ensure(ok, gate, message) { if (!ok) throw new GateError(gate, message); }

/* Evalúa el subconjunto cerrado usado por estos contratos. No es un validador
   general de JSON Schema. Rechaza keywords desconocidas en esquemas evaluados. */
function validate(schema, value, root = schema, path = "$") {
  const allowed = new Set(["$schema","$id","$ref","$defs","title","description","type","properties","required",
    "additionalProperties","items","minItems","maxItems","minLength","maxLength","minimum","maximum",
    "enum","const","pattern","oneOf","allOf","if","then","else"]);
  for (const k of Object.keys(schema)) ensure(allowed.has(k), "Schema", "Keyword no soportada: " + k);
  if (schema.$ref) {
    ensure(schema.$ref.startsWith("#/$defs/"), "Schema", "Solo refs locales");
    const target = root.$defs[schema.$ref.slice(8)];
    ensure(target, "Schema", "Ref desconocida"); return validate(target, value, root, path);
  }
  if (schema.const !== undefined) ensure(canonical(value) === canonical(schema.const), "Schema", path + " const");
  if (schema.enum) ensure(schema.enum.some(x => canonical(x) === canonical(value)), "Schema", path + " enum");
  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    ensure(types.some(t => t === "null" ? value === null : t === "array" ? Array.isArray(value)
      : t === "object" ? value !== null && typeof value === "object" && !Array.isArray(value)
      : t === "integer" ? Number.isInteger(value) : t === "number" ? typeof value === "number" && Number.isFinite(value)
      : typeof value === t), "Schema", path + " type");
  }
  if (typeof value === "string") {
    if (schema.minLength !== undefined) ensure([...value].length >= schema.minLength,"Schema",path+" minLength");
    if (schema.maxLength !== undefined) ensure([...value].length <= schema.maxLength,"Schema",path+" maxLength");
    if (schema.pattern) ensure(new RegExp(schema.pattern).test(value),"Schema",path+" pattern");
  }
  if (typeof value === "number") {
    if (schema.minimum !== undefined) ensure(value >= schema.minimum,"Schema",path+" minimum");
    if (schema.maximum !== undefined) ensure(value <= schema.maximum,"Schema",path+" maximum");
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined) ensure(value.length >= schema.minItems,"Schema",path+" minItems");
    if (schema.maxItems !== undefined) ensure(value.length <= schema.maxItems,"Schema",path+" maxItems");
    if (schema.items) value.forEach((x,i) => validate(schema.items,x,root,path+"["+i+"]"));
  }
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    for (const k of schema.required || []) ensure(Object.hasOwn(value,k),"Schema",path+" falta "+k);
    for (const [k,v] of Object.entries(value)) {
      if (schema.properties && Object.hasOwn(schema.properties,k)) validate(schema.properties[k],v,root,path+"."+k);
      else if (schema.additionalProperties === false) throw new GateError("Schema",path+" campo extra "+k);
      else if (typeof schema.additionalProperties === "object") validate(schema.additionalProperties,v,root,path+"."+k);
    }
  }
  for (const s of schema.allOf || []) validate(s,value,root,path);
  if (schema.oneOf) {
    let n=0; for(const s of schema.oneOf) { try { validate(s,value,root,path); n++; } catch(e) { if(!(e instanceof GateError)) throw e; } }
    ensure(n===1,"Schema",path+" oneOf");
  }
  if (schema.if) {
    let match=true; try { validate(schema.if,value,root,path); } catch { match=false; }
    const branch=match ? schema.then : schema.else; if(branch) validate(branch,value,root,path);
  }
  return true;
}
class Interview {
  #answers = {}; #confirmation = null; #confirmed = null; #revision = 1; #input;
  constructor(input, questions) { this.#input = canonical(input); this.questions = clone(questions); }
  answer(id, choice, literal_response, confidence, free_text) {
    const q=this.questions.find(x=>x.id===id);
    ensure(q && Object.hasOwn(q.options,choice),"Interview","Opción inválida");
    ensure(["high","med","low"].includes(confidence) && typeof literal_response==="string" && literal_response.trim(),
      "Interview","Guardar respuesta literal y confianza");
    ensure(!q.options[choice].startsWith("Otro") || (typeof free_text==="string" && free_text.trim()),
      "Interview","Otro requiere texto libre");
    this.#answers[id]={choice,literal_response,confidence,...(free_text===undefined?{}:{free_text})};
    this.#revision++; this.#confirmation=null; this.#confirmed=null;
  }
  summary() {
    ensure(this.questions.every(q=>this.#answers[q.id]),"Interview","Faltan respuestas Q1–Q10");
    const text=this.questions.map(q=>q.id+". "+q.text+"\n"+this.#answers[q.id].choice+": "+
      q.options[this.#answers[q.id].choice]+"\nRespuesta literal: "+this.#answers[q.id].literal_response+
      "\nConfianza: "+this.#answers[q.id].confidence+
      (this.#answers[q.id].free_text ? "\nDetalle: "+this.#answers[q.id].free_text : "")).join("\n\n");
    return {text, digest:canonical({input:this.#input,answers:this.#answers,revision:this.#revision})};
  }
  confirm(answer, shownDigest) {
    ensure(answer==="Yes" || answer==="No","Interview","Confirmación literal Yes/No");
    ensure(shownDigest===this.summary().digest,"Interview","El resumen cambió; volver a mostrarlo");
    this.#confirmation=answer; this.#confirmed=answer==="Yes"?shownDigest:null;
  }
  snapshot() { return clone(this.#answers); }
  assertConfirmed(input) {
    ensure(canonical(input)===this.#input && this.#confirmation==="Yes" &&
      this.#confirmed===this.summary().digest,"Interview","Entrevista completa y Yes vigente obligatorios");
  }
}
const emptyProvenance=()=>({mode:"not_run",adapter_id:null,retrieval_queries:[],results:[],
  index_version:null,ranking_version:"rrf-60-v1"});
function makeRuntime(schemas, questions, adapters, config) {
  const issued = new WeakMap();
  const runInputs = new Map();
  const requiredGates=["InputSchema","Policy","LengthCalibration","RetrievalProvenance","Attribution",
    "BiasCheck","PIICheck","CareerAlignment","SelfCritique","WorkflowSchema","ExecutionContract"];
  const event = async (kind,data) => adapters.audit({kind,at:adapters.now(),...data});
  const count = x => {
    const n=adapters.countTokens(typeof x==="string"?x:canonical(x));
    ensure(Number.isInteger(n)&&n>=0,"LengthCalibration","Tokenizer inválido"); return n;
  };
  const budget=(x,input)=>ensure(count(x)+(config.output_reserve_tokens||2048)+(config.safety_tokens||256)
    <=(input.max_tokens||8192),"LengthCalibration","Contexto excedido; recortar o resumir y volver a confirmar");
  function policy(answers) {
    const c=id=>answers[id].choice;
    ensure(c("Q3")!=="D","Policy","Sugerir nivel de verificación y solicitar elección explícita");
    ensure(c("Q10")!=="C","Policy","Q10 C contradice atribución obligatoria; elegir A o B y reconfirmar");
    ensure(c("Q5")!=="D" || config.custom_format_resolved===true,"Policy","Resolver formato Otro");
    const local=c("Q4")==="A" || c("Q4")==="B";
    ensure(!local || ["applicable","not_applicable"].includes(config.local_applicability),"Policy",
      "Determinar y registrar aplicabilidad local");
    ensure(!local || config.local_applicability!=="applicable" || config.local_region,"Policy","Falta región local");
    return {web:c("Q8")!=="C",academic:c("Q8")==="B",level:c("Q3"),inference:c("Q10")==="B",
      requireLocal:local && config.local_applicability==="applicable",
      roles:c("Q9"),localPreference:c("Q4")};
  }
  async function sourceOK(s,p) {
    validate({$ref:"#/$defs/source",$defs:schemas.workflow.$defs},s);
    ensure(config.test_mode || s.record_kind==="runtime","RetrievalProvenance","Fixture prohibido en producción");
    ensure(p.localPreference!=="C" || s.region!=="local","RetrievalProvenance","Fuente local excluida por Q4");
    ensure(!p.academic || ["gov","edu"].includes(s.source_type),"RetrievalProvenance","Q8 limita a gov/edu");
    const att=await adapters.verifySource(clone(s),p);
    ensure(att && att.authorized===true && att.content_matches===true && att.identity_verified===true &&
      s.verified===true,"RetrievalProvenance","Fuente no verificada por adaptador confiable");
    const year=Number(adapters.now().slice(0,4));
    ensure(Number.isInteger(s.year)&&s.year<=year,"RetrievalProvenance","Año ausente o futuro");
    ensure(s.year>=year-5 || (s.canonical && s.recent_review_id),"RetrievalProvenance",
      "Fuente antigua sin revisión reciente");
  }
  async function retrieve(queries,p) {
    ensure(adapters.retrieval && adapters.retrieval.mode===(p.web?"online":"offline"),"RetrievalProvenance",
      "Conector requerido no disponible o modo incorrecto");
    const results=[];
    for(const query of queries) {
      const opts={allowed_types:p.academic?["gov","edu"]:["peer_reviewed","gov","edu","official_standard","vendor_docs"],
        domain_filters:config.domain_filters||[],local_region:config.local_region||null,local_preference:p.localPreference,
        allow_network:p.web,limit:20};
      const sparse=await adapters.retrieval.sparse(query,opts);
      const dense=await adapters.retrieval.dense(query,opts);
      ensure(Array.isArray(sparse)&&Array.isArray(dense),"RetrievalProvenance","Resultados inválidos");
      const byId=new Map(),scores=new Map();
      for(const list of [sparse,dense]) {
        const seen=new Set();
        for(let i=0;i<list.length;i++) {
          const s=list[i]; if(seen.has(s.id)) continue; seen.add(s.id);
          if(byId.has(s.id)) ensure(byId.get(s.id).content_hash===s.content_hash,"RetrievalProvenance","ID inconsistente");
          byId.set(s.id,s); scores.set(s.id,(scores.get(s.id)||0)+1/(60+i+1));
        }
      }
      const eligible=[];
      for(const [id,s] of byId) {
        try { await sourceOK(s,p); eligible.push({...s,score:scores.get(id)}); }
        catch(e) { if(!(e instanceof GateError)) throw e; await event("source_rejected",{source_id:id,reason:e.message}); }
      }
      const ranked=eligible.sort((a,b)=>(p.localPreference==="A" ? Number(b.region==="local")-Number(a.region==="local") : 0) || b.score-a.score || a.id.localeCompare(b.id));
      results.push({query,sparse_ids:sparse.map(s=>s.id),dense_ids:dense.map(s=>s.id),top_hits:ranked.slice(0,5)});
    }
    const prov={mode:p.web?"online":"offline",adapter_id:adapters.retrieval.id,retrieval_queries:queries,
      results,index_version:adapters.retrieval.index_version,ranking_version:"rrf-60-v1"};
    const all=[...new Map(results.flatMap(r=>r.top_hits).map(s=>[s.id,s])).values()];
    for(const s of all.filter(s=>s.canonical)) {
      const review=all.find(x=>x.id===s.recent_review_id);
      ensure(review && review.year>=Number(adapters.now().slice(0,4))-5 &&
        await adapters.verifyCanonicalCitation(s,review),"RetrievalProvenance","Revisión canónica no comprobada");
    }
    return prov;
  }
  async function attribution(draft,prov,p) {
    const qa=await adapters.attribute({draft:clone(draft),provenance:clone(prov)});
    ensure(qa && qa.complete_inventory===true && Array.isArray(qa.claims),"Attribution","Inventario factual incompleto");
    const sources=[...new Map(prov.results.flatMap(r=>r.top_hits).map(s=>[s.content_hash,s])).values()];
    const minimum=p.level==="A"?2:p.level==="B"?1:0;
    ensure(sources.length>=minimum,"Attribution","No alcanza mínimo de fuentes distintas");
    if(p.level==="A") {
      ensure(sources.some(s=>s.region==="international"),"Attribution","Alta exige fuente internacional");
      ensure(!p.requireLocal || sources.some(s=>s.region==="local"),"Attribution","Falta fuente local aplicable");
    }
    try {
    for(const c of qa.claims) {
      validate({$ref:"#/$defs/claim",$defs:schemas.workflow.$defs},c);
      if(c.status==="SUPPORTED") {
        ensure(!c.inference && c.source_ids.length>0 && c.source_ids.length===c.passage_quotes.length,
          "Attribution","Referencia factual incompleta");
        for(let i=0;i<c.source_ids.length;i++) {
          const s=sources.find(s=>s.id===c.source_ids[i]);
          ensure(s && c.passage_quotes[i].length>0 && s.passage.includes(c.passage_quotes[i]),
            "Attribution","Pasaje no recuperado");
        }
      } else {
        ensure(p.level!=="A","Attribution","Alta con UNSUPPORTED: detener; cambiar requisito y reconfirmar para fallback");
        ensure(p.inference && c.inference && c.explanation.trim(),"Attribution","Inferencia sin permiso o explicación");
      }
    }
    } catch(e) { e.claims=qa.claims; throw e; }
    return qa.claims;
  }
  function workflowCheck(w, answers) {
    validate(schemas.workflow,w);
    ensure(w.mcp_schema.type==="object" && w.mcp_schema.properties && w.output_schema.type==="object","ExecutionContract","Entradas y salidas deben ser objetos tipados");
    if(["B","C"].includes(answers.Q5.choice)) ensure(w.prompt_spec!==null,"ExecutionContract","Q5 B/C requiere prompt JSON");
    ensure(canonical(w.preconditions)===canonical(w.mcp_schema),"ExecutionContract","Esquemas de entrada divergentes");
    const available=new Set(["input"]),ids=new Set();
    for(const s of w.steps) {
      ensure(!ids.has(s.id),"ExecutionContract","ID de paso duplicado"); ids.add(s.id);
      ensure(Object.hasOwn(adapters.handlers,s.handler),"ExecutionContract","Handler no registrado: "+s.handler);
      ensure(s.retry_policy.max_attempts===1 || s.retry_policy.idempotent,"ExecutionContract","Reintento no idempotente");
      for(const ref of Object.values(s.inputs)) ensure(available.has(ref),"ExecutionContract","Ref adelantada o desconocida "+ref);
      for(const name of s.outputs) {
        const ref=s.id+"."+name; ensure(!available.has(ref),"ExecutionContract","Salida duplicada"); available.add(ref);
      }
      validateSchemaSubset(s.validation.output_schema);
    }
    for(const ref of Object.values(w.outputs)) ensure(available.has(ref),"ExecutionContract","Salida final desconocida");
    validateSchemaSubset(w.mcp_schema); validateSchemaSubset(w.output_schema);
    for(const g of requiredGates) ensure(w.validation_gates.some(x=>x.name===g && x.critical),
      "ExecutionContract","Falta gate crítica "+g);
    const q9=answers.Q9.choice;
    ensure(q9!=="C" || w.role_labels.length===0,"CareerAlignment","Q9 prohíbe roles");
    ensure(q9!=="B" || w.role_labels.every(x=>(config.requested_roles||[]).includes(x)),
      "CareerAlignment","Rol no solicitado");
    if(answers.Q5.choice==="C") ensure(w.unit_tests.length===2 &&
      w.unit_tests.some(x=>x.kind==="positive") && w.unit_tests.some(x=>x.kind==="negative"),
      "ExecutionContract","Q5 C requiere prueba positiva y negativa");
  }
  async function build(input,session) {
    /* Interview throws BEFORE any retrieval or generation, without emitting workflow JSON. */
    session.assertConfirmed(input);
    const answers=session.snapshot(),flags=[];
    let prov=emptyProvenance(),critique=[],claims=[];
    const pass=(gate,reason="Comprobación completada")=>flags.push({gate,status:"PASS",critical:true,reason});
    const pack=(workflows,report)=>({status:report?"manual_review":"ready",mcq_responses:answers,
      verification_summary:{gates:flags,overall:report?"FAIL":"PASS"},workflows,retrieval_provenance:prov,
      validation_flags:flags,manual_review_report:report,
      confidence_note:report?["Una gate crítica bloqueó la publicación.","No se adjuntan workflows ejecutables.",
        "Resolver los hallazgos y repetir las verificaciones."]:
        ["Se completaron las gates configuradas con los adaptadores disponibles.",
         "La verificación semántica depende del QA de atribución y de sus fuentes.",
         "Las llamadas LLM y el retrieval externo no garantizan identidad bit a bit; usar snapshots."],
      manual_review_template:{unsupported_sentences:[],provenance:prov,suggested_fixes:[]},
      self_critique:critique,record_kind:config.test_mode?"synthetic_fixture":"runtime"});
    try {
      validate(schemas.input,input); validate({$ref:"#/$defs/answers",$defs:schemas.input.$defs},answers); pass("InputSchema");
      const p=policy(answers);
      const safety=await adapters.safety(input);
      ensure(safety && safety.allowed===true,"Policy","Solicitud no autorizada por revisión de seguridad");
      pass("Policy");
      budget({input,answers,prompts:config.prompt_bundle},input);
      pass("LengthCalibration");
      const queries=await adapters.queries({input,answers,policy:p});
      validate({type:"array",items:{type:"string",minLength:1},minItems:3,maxItems:5},queries);
      ensure(new Set(queries).size===queries.length,"RetrievalProvenance","Queries duplicadas");
      prov=await retrieve(queries,p); pass("RetrievalProvenance");
      budget({input,answers,provenance:prov,prompts:config.prompt_bundle},input);
      const plan=await adapters.plan({input,answers,provenance:prov});
      await attribution(plan,prov,p); // claim plan before generation
      const drafts=await adapters.generate({input,answers,provenance:prov,plan,
        workflow_schema:schemas.workflow,prompt_bundle:config.prompt_bundle});
      ensure(Array.isArray(drafts) && drafts.length===(input.workflow_count||1),"WorkflowSchema","Cantidad incorrecta");
      /* Final-text attribution is mandatory: generation can introduce new claims. */
      claims=await attribution(drafts,prov,p); pass("Attribution");
      const privacy=await adapters.privacyAndFairness({input,drafts});
      ensure(privacy && privacy.pii_pass===true && privacy.risk!=="high","PIICheck","PII o riesgo alto requiere revisión humana");
      pass("PIICheck");
      ensure(privacy.bias_pass===true,"BiasCheck","Sesgo sin resolver"); pass("BiasCheck");
      critique=await adapters.critique({input,drafts,claims});
      validate({type:"array",minItems:0,maxItems:3,items:{type:"object",required:["risk","mitigation"],
        properties:{risk:{enum:["hallucination","ambiguity","bias"]},mitigation:{type:"string",minLength:1}},
        additionalProperties:false}},critique);
      ensure(await adapters.resolveCritique(critique,drafts),"SelfCritique","Riesgos pendientes"); pass("SelfCritique");
      for(let i=0;i<drafts.length;i++) {
        const w=drafts[i];
        w.claims=claims.filter(c=>c.json_pointer.startsWith("/"+i+"/"));
        w.rag_config={queries,domain_filters:config.domain_filters||[],top_k:5};
        w.audit={retrieval_provenance:prov,prompt_version:config.prompt_version,timestamp:adapters.now(),author:config.author};
        w.prompt_version=config.prompt_version;
        w.metadata={mcq_responses:answers,retrieval_provenance:prov,validation_flags:flags};
        workflowCheck(w,answers);
      }
      ensure(claims.every(c=>/^\/[0-9]+\//.test(c.json_pointer) && Number(c.json_pointer.split("/")[1])<drafts.length),"Attribution","Claim sin ubicación de workflow");
      pass("CareerAlignment"); pass("WorkflowSchema"); pass("ExecutionContract");
      const result=pack(drafts,null); budget(result,input); validate(schemas.output,result);
      await event("package_issued",{status:"ready",workflow_ids:drafts.map(w=>w.id),prompt_version:config.prompt_version});
      const copy=clone(result); issued.set(copy,canonical(copy)); return copy;
    } catch(e) {
      if(e.claims) claims=e.claims;
      const gate=e.gate||"AdapterFailure";
      flags.push({gate,status:"FAIL",critical:true,reason:e instanceof GateError?e.message:"Adaptador falló; consultar auditoría privada"});
      const report={failed_gates:[gate],unsupported_sentences:claims.filter(c=>c.status==="UNSUPPORTED").map(c=>c.sentence),
        provenance:prov,suggested_fixes:[e instanceof GateError?e.message:"Restaurar adaptador y repetir gates"],
        retry_from:gate==="Policy"?"interview":"preprocessor"};
      const result=pack([],report); validate(schemas.output,result);
      try { await event("package_blocked",{gate}); } catch { /* Failure remains blocked; never issue. */ }
      return result;
    }
  }
  async function run(packet,workflowId,input,context) {
    ensure(issued.has(packet) && issued.get(packet)===canonical(packet),"ExecutionContract",
      "Paquete no emitido por esta sesión o modificado; volver a validar/reemitir");
    ensure(packet.status==="ready","ExecutionContract","Paquete bloqueado");
    ensure(config.test_mode || packet.record_kind==="runtime","ExecutionContract","Fixture en producción");
    const w=packet.workflows.find(x=>x.id===workflowId);
    ensure(w,"ExecutionContract","Workflow desconocido"); workflowCheck(w,packet.mcq_responses);
    validate(w.mcp_schema,input);
    ensure(context && typeof context.run_id==="string" && context.run_id.length>0 &&
      typeof context.executeOnce==="function" && typeof context.sleep==="function" && typeof context.withTimeout==="function","ExecutionContract",
      "Falta run_id, almacén idempotente o reloj");
    const runKey=canonical([context.run_id,w.id,w.workflow_version]);
    ensure(!runInputs.has(runKey) || runInputs.get(runKey)===canonical(input),"ExecutionContract","run_id reutilizado con otra entrada");
    runInputs.set(runKey,canonical(input));
    const values={input};
    for(const s of w.steps) {
      const args=Object.fromEntries(Object.entries(s.inputs).map(([k,ref])=>[k,values[ref]]));
      const key=canonical([context.run_id,w.id,w.workflow_version,s.id]);
      let output;
      for(let attempt=1;attempt<=s.retry_policy.max_attempts;attempt++) {
        await event("step_started",{run_id:context.run_id,workflow_id:w.id,step_id:s.id,attempt});
        try {
          output=await context.executeOnce(key,async()=>{
            const x=await context.withTimeout(s.timeout_ms,signal=>adapters.handlers[s.handler](clone(args),{idempotency_key:key,timeout_ms:s.timeout_ms,signal}));
            validate(s.validation.output_schema,x);
            for(const name of s.outputs) ensure(Object.hasOwn(x,name),"ExecutionContract","Handler no produjo "+name);
            return x;
          });
          validate(s.validation.output_schema,output);
          break;
        } catch(e) {
          await event("step_failed",{run_id:context.run_id,step_id:s.id,attempt,code:e.code||e.gate||"ERROR"});
          if(attempt===s.retry_policy.max_attempts || !s.retry_policy.retry_on.includes(e.code)) throw e;
          await context.sleep(s.retry_policy.backoff_seconds*1000*2**(attempt-1));
        }
      }
      for(const name of s.outputs) values[s.id+"."+name]=output[name];
      await event("step_completed",{run_id:context.run_id,step_id:s.id});
    }
    const result=Object.fromEntries(Object.entries(w.outputs).map(([name,ref])=>[name,values[ref]]));
    validate(w.output_schema,result);
    ensure(await adapters.validateRunOutput({workflow:w,result}),"RuntimeQA","Salida falló gates; retener entrega");
    await event("run_completed",{run_id:context.run_id,workflow_id:w.id});
    return result;
  }
  return {build,run,workflowCheck,requiredGates};
}
function validateSchemaSubset(s) {
  const allowed=["$schema","$id","title","description","type","properties","required","additionalProperties",
    "items","minItems","maxItems","minLength","maxLength","minimum","maximum","enum","const","pattern","oneOf","allOf","if","then","else"];
  ensure(s && typeof s==="object" && !Array.isArray(s),"Schema","Esquema embebido inválido");
  for(const [k,v] of Object.entries(s)) {
    ensure(allowed.includes(k),"Schema","Keyword embebida no soportada "+k);
    if(k==="properties") Object.values(v).forEach(validateSchemaSubset);
    if(["items","if","then","else"].includes(k) || k==="additionalProperties" && typeof v==="object") validateSchemaSubset(v);
    if(["oneOf","allOf"].includes(k)) v.forEach(validateSchemaSubset);
  }
}
const API={Interview,GateError,validate,makeRuntime,canonical,emptyProvenance};
if(typeof module!=="undefined") module.exports=API;
