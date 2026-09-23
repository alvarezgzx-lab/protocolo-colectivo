"use strict";
async function runTests(API, schemas, questions) {
  const {Interview,makeRuntime,validate,canonical}=API;
  const results=[];
  const assert=(x,m="assertion")=>{if(!x) throw Error(m);};
  const fixtureSource=id=>({id,title:"Fixture "+id,author:"Synthetic test author",year:2026,
    domain:"fixture.invalid",url:"https://fixture.invalid/"+id,snippet:"Synthetic passage",
    passage:"Synthetic test claim only.",score:0.5,source_type:"gov",region:id==="local"?"local":"international",
    content_hash:"fixture-hash-"+id,retrieved_at:"2026-09-23T12:00:00Z",record_kind:"synthetic_fixture",
    verified:true,canonical:false,recent_review_id:null});
  function fixture(overrides={}) {
    const input={user_instruction:"Convertir texto a mayúsculas para una prueba sintética",topic:"test",
      max_tokens:100000,workflow_count:1};
    const session=new Interview(input,questions);
    const choices={Q1:"B",Q2:"B",Q3:"A",Q4:"A",Q5:"A",Q6:"B",Q7:"D",Q8:"C",Q9:"C",Q10:"A",...overrides};
    for(const q of questions) session.answer(q.id,choices[q.id],choices[q.id],"high");
    session.confirm("Yes",session.summary().digest);
    const log=[],counts={retrieval:0,generate:0,handlers:0};
    const source1=fixtureSource("international"),source2=fixtureSource("local");
    const io={type:"object",properties:{text:{type:"string",minLength:1}},required:["text"],additionalProperties:false};
    const adapters={
      now:()=>"2026-09-23T12:00:00Z",countTokens:x=>Math.ceil(x.length/3),
      audit:async x=>log.push(x),safety:async()=>({allowed:true}),
      queries:async()=>["synthetic query one","synthetic query two","synthetic query three"],
      retrieval:{id:"synthetic-offline",mode:"offline",index_version:"fixture-v1",
        sparse:async()=>{counts.retrieval++;return [source1,source2];},
        dense:async()=>[source2,source1]},
      verifySource:async()=>({authorized:true,content_matches:true,identity_verified:true}),
      verifyCanonicalCitation:async()=>true,
      plan:async()=>({instruction:"Synthetic plan"}),
      attribute:async()=>({complete_inventory:true,claims:[]}),
      privacyAndFairness:async()=>({pii_pass:true,bias_pass:true,risk:"low"}),
      critique:async()=>[{risk:"ambiguity",mitigation:"Usar contrato tipado de entrada"}],
      resolveCritique:async()=>true,validateRunOutput:async()=>true,
      handlers:{"uppercase.v1":async({payload})=>{counts.handlers++;return {text:payload.text.toUpperCase()};}},
      generate:async()=>{
        counts.generate++;
        return [{id:"12345678-1234-4234-8234-123456789abc",title:"Fixture: uppercase",description:"Synthetic test only",
          workflow_version:"1.0.0",prompt_version:"1.0.0",preconditions:io,mcp_schema:io,
          steps:[{id:"s1",type:"transform",handler:"uppercase.v1",action:"Convertir texto a mayúsculas",
            inputs:{payload:"input"},outputs:["text"],validation:{output_schema:io},
            retry_policy:{max_attempts:2,backoff_seconds:0,retry_on:["TRANSIENT"],idempotent:true},timeout_ms:1000}],
          triggers:[{type:"manual"}],outputs:{text:"s1.text"},output_schema:io,
          rag_config:{queries:["a","b","c"],domain_filters:[],top_k:5},
          validation_gates:runtime.requiredGates.map(name=>({name,critical:true,on_pass:"continue",on_fail:"manual_review"})),
          audit:{},examples:[{input:{text:"hola"},expected_output:{text:"HOLA"}}],metadata:{},role_labels:[],claims:[],
          prompt_spec:["B","C"].includes(choices.Q5)?{model_ref:"runtime:model",temperature:0,seed:1,messages:[{role:"user",content:"Synthetic prompt"}]}:null,
          unit_tests:choices.Q5==="C"?[{kind:"positive",input:{text:"hola"},expected:{text:"HOLA"}},
            {kind:"negative",input:{text:3},expected:{gate:"Schema"}}]:[]}];
      }
    };
    const config={test_mode:true,local_applicability:"applicable",local_region:"MX",author:"test-suite",
      prompt_version:"1.0.0",prompt_bundle:"Synthetic prompts; not production",output_reserve_tokens:512};
    const runtime=makeRuntime(schemas,questions,adapters,config);
    const cache=new Map();
    const context={run_id:"test-run",sleep:async()=>{},withTimeout:async(ms,fn)=>fn(undefined),executeOnce:async(key,fn)=>{
      if(cache.has(key))return cache.get(key);const x=await fn();cache.set(key,x);return x;}};
    return {input,session,adapters,config,runtime,counts,log,context,source1,source2};
  }
  async function test(name,fn) {try{await fn();results.push({name,status:"PASS"});}
    catch(e){results.push({name,status:"FAIL",reason:e.message});}}
  async function rejects(fn,gate) {let e;try{await fn();}catch(x){e=x;}assert(e&&(!gate||e.gate===gate),"Expected rejection "+gate);}
  const blocked=async(f,gate)=>{const p=await f.runtime.build(f.input,f.session);assert(p.status==="manual_review");
    assert(p.workflows.length===0);assert(p.validation_flags.some(g=>g.gate===gate&&g.status==="FAIL"),"Missing "+gate);
    validate(schemas.output,p);return p;};
  await test("positive: confirmed offline pipeline and custom runner",async()=>{
    const f=fixture();const p=await f.runtime.build(f.input,f.session);assert(p.status==="ready",canonical(p.manual_review_report));
    validate(schemas.output,p);
    const out=await f.runtime.run(p,p.workflows[0].id,{text:"hola"},f.context);
    assert(out.text==="HOLA");assert(f.log.some(x=>x.kind==="run_completed"));
    await f.runtime.run(p,p.workflows[0].id,{text:"hola"},f.context);assert(f.counts.handlers===1);
  });
  await test("incomplete MCQ prevents retrieval and generation",async()=>{
    const f=fixture();f.session=new Interview(f.input,questions);
    await rejects(()=>f.runtime.build(f.input,f.session),"Interview");assert(f.counts.retrieval===0&&f.counts.generate===0);
  });
  await test("No blocks; editable answers require new Yes",async()=>{
    const f=fixture();f.session.confirm("No",f.session.summary().digest);
    await rejects(()=>f.runtime.build(f.input,f.session),"Interview");
    f.session.answer("Q6","A","A","high");
    await rejects(()=>f.runtime.build(f.input,f.session),"Interview");
    f.session.confirm("Yes",f.session.summary().digest);assert((await f.runtime.build(f.input,f.session)).status==="ready");
  });
  await test("stale summary and changed instruction invalidate confirmation",async()=>{
    const f=fixture(),old=f.session.summary().digest;f.session.answer("Q6","A","A","high");
    await rejects(()=>f.session.confirm("Yes",old),"Interview");
    f.session.confirm("Yes",f.session.summary().digest);f.input.topic="changed";
    await rejects(()=>f.runtime.build(f.input,f.session),"Interview");
  });
  await test("Q10 C blocks unmarked inference",async()=>{const f=fixture({Q10:"C"});await blocked(f,"Policy");assert(!f.counts.generate);});
  await test("Q3 D requires explicit resolution",async()=>{await blocked(fixture({Q3:"D"}),"Policy");});
  await test("missing schema field stops preprocessor",async()=>{
    const f=fixture();delete f.input.topic;f.session=new Interview(f.input,questions);
    for(const q of questions)f.session.answer(q.id,"A","A","high");
    f.session.confirm("Yes",f.session.summary().digest);await blocked(f,"Schema");
  });
  await test("token overflow prevents retrieval",async()=>{
    const f=fixture();f.adapters.countTokens=()=>100001;await blocked(f,"LengthCalibration");assert(!f.counts.retrieval);
  });
  await test("offline rejects online connector",async()=>{const f=fixture();f.adapters.retrieval.mode="online";await blocked(f,"RetrievalProvenance");});
  await test("high verification fails with one distinct source",async()=>{
    const f=fixture();f.adapters.retrieval.sparse=async()=>[f.source1];f.adapters.retrieval.dense=async()=>[f.source1];
    await blocked(f,"Attribution");assert(!f.counts.generate);
  });
  await test("high verification requires applicable local source",async()=>{
    const f=fixture();f.source2.region="international";await blocked(f,"Attribution");
  });
  await test("Q8 academic excludes vendor docs",async()=>{
    const f=fixture({Q8:"B"});f.adapters.retrieval.mode="online";f.source1.source_type="vendor_docs";
    await blocked(f,"Attribution");
  });
  await test("untrusted sources do not count",async()=>{
    const f=fixture();f.adapters.verifySource=async()=>({authorized:false});await blocked(f,"Attribution");
  });
  await test("old sources require verified recent review",async()=>{
    const f=fixture();f.source1.year=2000;f.source1.canonical=true;f.source1.recent_review_id="missing";
    await blocked(f,"RetrievalProvenance");
  });
  await test("invented citation blocks attribution",async()=>{
    const f=fixture();f.adapters.attribute=async()=>({complete_inventory:true,claims:[{
      id:"c1",sentence:"Synthetic claim",json_pointer:"/0/description",status:"SUPPORTED",
      source_ids:["nonexistent"],passage_quotes:["Synthetic"],inference:false,explanation:""}]});
    await blocked(f,"Attribution");
  });
  await test("post-generation QA catches new unsupported claim",async()=>{
    const f=fixture();f.adapters.attribute=async({draft})=>({complete_inventory:true,claims:Array.isArray(draft)?[{
      id:"c1",sentence:"Unsupported invented assertion",json_pointer:"/0/description",status:"UNSUPPORTED",
      source_ids:[],passage_quotes:[],inference:true,explanation:"Test"}]:[]});
    const p=await blocked(f,"Attribution");assert(p.manual_review_report.unsupported_sentences.includes("Unsupported invented assertion"));assert(f.counts.generate===1);
  });
  await test("low verification permits explicitly labelled inference",async()=>{
    const f=fixture({Q3:"C",Q10:"B"});f.adapters.attribute=async()=>({complete_inventory:true,claims:[{
      id:"c1",sentence:"Synthetic inference",json_pointer:"/0/description",status:"UNSUPPORTED",
      source_ids:[],passage_quotes:[],inference:true,explanation:"Supuesto sintético explícito"}]});
    assert((await f.runtime.build(f.input,f.session)).status==="ready");
  });
  await test("high privacy risk requires manual review",async()=>{
    const f=fixture();f.adapters.privacyAndFairness=async()=>({pii_pass:true,bias_pass:true,risk:"high"});
    await blocked(f,"PIICheck");
  });
  await test("critical self-critique cannot be ignored",async()=>{
    const f=fixture();f.adapters.resolveCritique=async()=>false;await blocked(f,"SelfCritique");
  });
  await test("Q5 C supplies positive and negative workflow tests",async()=>{
    const f=fixture({Q5:"C"});const p=await f.runtime.build(f.input,f.session);assert(p.status==="ready");
    const w=p.workflows[0];
    assert((await f.runtime.run(p,w.id,w.unit_tests[0].input,f.context)).text==="HOLA");
    await rejects(()=>f.runtime.run(p,w.id,w.unit_tests[1].input,f.context),"Schema");
  });
  await test("unknown handler fails before execution",async()=>{
    const f=fixture();delete f.adapters.handlers["uppercase.v1"];await blocked(f,"ExecutionContract");
  });
  await test("forward references fail compilation",async()=>{
    const f=fixture(),gen=f.adapters.generate;f.adapters.generate=async()=>{const ws=await gen();ws[0].steps[0].inputs.payload="future.text";return ws;};
    await blocked(f,"ExecutionContract");
  });
  await test("retry must be idempotent",async()=>{
    const f=fixture(),gen=f.adapters.generate;f.adapters.generate=async()=>{const ws=await gen();ws[0].steps[0].retry_policy.idempotent=false;return ws;};
    await blocked(f,"ExecutionContract");
  });
  await test("bounded transient retry succeeds",async()=>{
    const f=fixture();let calls=0;f.adapters.handlers["uppercase.v1"]=async({payload})=>{
      if(++calls===1){const e=Error("transient");e.code="TRANSIENT";throw e;}return {text:payload.text.toUpperCase()};};
    const p=await f.runtime.build(f.input,f.session);
    assert((await f.runtime.run(p,p.workflows[0].id,{text:"hola"},f.context)).text==="HOLA");assert(calls===2);
  });
  await test("permanent failure is not retried",async()=>{
    const f=fixture();let calls=0;f.adapters.handlers["uppercase.v1"]=async()=>{calls++;throw Error("permanent");};
    const p=await f.runtime.build(f.input,f.session);
    await rejects(()=>f.runtime.run(p,p.workflows[0].id,{text:"hola"},f.context));assert(calls===1);
  });
  await test("tampered package rejected",async()=>{
    const f=fixture(),p=await f.runtime.build(f.input,f.session);p.workflows[0].title="changed";
    await rejects(()=>f.runtime.run(p,p.workflows[0].id,{text:"hola"},f.context),"ExecutionContract");
  });
  await test("synthetic sources cannot pass production mode",async()=>{
    const f=fixture();f.config.test_mode=false;await blocked(f,"Attribution");
  });
  await test("output schema forbids workflow in manual review",async()=>{
    const f=fixture(),p=await f.runtime.build(f.input,f.session);p.status="manual_review";
    await rejects(()=>validate(schemas.output,p),"Schema");
  });
  await test("runtime QA withholds failed output",async()=>{
    const f=fixture();f.adapters.validateRunOutput=async()=>false;const p=await f.runtime.build(f.input,f.session);
    await rejects(()=>f.runtime.run(p,p.workflows[0].id,{text:"hola"},f.context),"RuntimeQA");
  });
  await test("adapter exception produces manual review",async()=>{
    const f=fixture();f.adapters.queries=async()=>{throw Error("secret internal error");};
    const p=await blocked(f,"AdapterFailure");assert(!canonical(p).includes("secret internal"));
  });
  await test("same run_id cannot be reused with changed payload",async()=>{
    const f=fixture(),p=await f.runtime.build(f.input,f.session);
    await f.runtime.run(p,p.workflows[0].id,{text:"hola"},f.context);
    await rejects(()=>f.runtime.run(p,p.workflows[0].id,{text:"other"},f.context),"ExecutionContract");
  });
  await test("Other requires literal free text",async()=>{
    const f=fixture();await rejects(()=>f.session.answer("Q1","E","E","high"),"Interview");
  });
  await test("audit failure cannot issue ready packet",async()=>{
    const f=fixture();f.adapters.audit=async()=>{throw Error("storage unavailable");};
    await blocked(f,"AdapterFailure");
  });
  await test("handler timeout does not retry uncertain effects",async()=>{
    const f=fixture(),p=await f.runtime.build(f.input,f.session);
    f.context.withTimeout=async()=>{const e=Error("timeout");e.code="TIMEOUT";throw e;};
    await rejects(()=>f.runtime.run(p,p.workflows[0].id,{text:"hola"},f.context));
    assert(f.log.filter(e=>e.kind==="step_failed").length===1);
  });
  await test("ready output cannot carry failed critical gates",async()=>{
    const f=fixture(),p=await f.runtime.build(f.input,f.session);
    p.validation_flags[0].status="FAIL";await rejects(()=>validate(schemas.output,p),"Schema");
  });
  return {results,passed:results.filter(x=>x.status==="PASS").length,failed:results.filter(x=>x.status==="FAIL").length};
}
if(typeof module!=="undefined")module.exports={runTests};
if(typeof require!=="undefined" && require.main===module) {
  const fs=require("node:fs"),path=require("node:path"),base=path.join(__dirname,"..");
  const schemas=Object.fromEntries(["input","interview","workflow","output"].map(k=>[k,JSON.parse(fs.readFileSync(path.join(base,"schemas",k+".schema.json"),"utf8"))]));
  runTests(require("../scripts/runtime.cjs"),schemas,JSON.parse(fs.readFileSync(path.join(base,"references/questions.json"),"utf8")))
    .then(r=>{console.log(JSON.stringify(r,null,2));process.exitCode=r.failed?1:0;});
}
