import{z as o}from"zod";var r=o.object({items:o.array(o.custom(()=>!0))}),t=o.object({xs:o.array(o.number()),ys:o.array(o.number()),occ:o.array(o.array(o.boolean()))});
