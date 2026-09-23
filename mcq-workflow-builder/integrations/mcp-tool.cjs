"use strict";
/* Descriptor independiente del SDK; el servidor realiza el registro MCP. */
function createMcpTool(runtime,schemas,getAuthenticatedSession) {
  return {
    descriptor:{
      name:"build_verified_workflows",
      description:"Genera workflows tras entrevista Q1-Q10 y Yes autenticado; devuelve manual_review ante fallo crítico.",
      inputSchema:schemas.input,
      outputSchema:schemas.output
    },
    invoke:async(input,requestContext)=>{
      const session=await getAuthenticatedSession(requestContext);
      if(!session) return {isError:true,content:[{type:"text",text:"INTERVIEW_REQUIRED: completar Q1–Q10 y confirmar Yes."}]};
      try {
        const result=await runtime.build(input,session);
        return {content:[{type:"text",text:JSON.stringify(result)}],structuredContent:result};
      } catch(e) {
        if(e.gate==="Interview") return {isError:true,content:[{type:"text",text:"INTERVIEW_REQUIRED: "+e.message}]};
        throw e;
      }
    }
  };
}
module.exports={createMcpTool};
