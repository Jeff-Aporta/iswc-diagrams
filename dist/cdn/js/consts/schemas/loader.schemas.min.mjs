import{z as t}from"zod";var e=()=>t.custom(o=>typeof o=="function"),i=t.object({registerApp:e(),load:e()}).passthrough();export{i as LoaderAppSchema};
