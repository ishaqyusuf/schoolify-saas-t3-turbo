import { Checkbox } from "@acme/ui/checkbox";
import { Label } from "@acme/ui/label";

export function CheckFilter({ label, ctx, value, qk }) {
  const query = ctx.query;
  return (
    <div className="my-0.5 inline-flex items-center gap-2">
      <Checkbox
        dir="rtl"
        onCheckedChange={(e) => {
          let clis = (query?.[qk] || "")?.split(",");
          if (e) clis?.push(value);
          else clis = clis?.filter((a) => a !== value);
          console.log(clis);
          const vals = clis?.filter(Boolean);
          const classes = vals.join(",");
          if (!vals.length)
            ctx.setQuery({
              [qk]: null,
            });
          else
            ctx.setQuery({
              [qk]: classes,
            });
        }}
        checked={query?.[qk]?.split(",").some((s) => s === value)}
      />
      <Label>{label}</Label>
    </div>
  );
}
