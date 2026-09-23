"use strict";
/* Solo desarrollo: sustituir Map por transacciones durables para producción. */
function createDevelopmentContext(run_id) {
  const operations=new Map();
  return {
    run_id,
    sleep:ms=>new Promise(resolve=>setTimeout(resolve,ms)),
    executeOnce:async(key,fn)=>{
      if(operations.has(key)) return operations.get(key);
      const pending=Promise.resolve().then(fn); operations.set(key,pending);
      try{return await pending;}catch(e){operations.delete(key);throw e;}
    },
    withTimeout:async(ms,fn)=>{
      const controller=new AbortController();let timer;
      const timeout=new Promise((_,reject)=>{
        timer=setTimeout(()=>{
          controller.abort();
          const error=new Error("Handler timeout; revisar estado externo antes de reintentar");
          error.code="TIMEOUT";reject(error);
        },ms);
      });
      try{return await Promise.race([Promise.resolve().then(()=>fn(controller.signal)),timeout]);}
      finally{clearTimeout(timer);}
    }
  };
}
module.exports={createDevelopmentContext};
