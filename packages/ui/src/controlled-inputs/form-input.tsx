import { ControllerProps, FieldPath, FieldValues } from "react-hook-form";

import { cn } from "..";
import { Button } from "../button";
import { FormControl, FormField, FormItem, FormLabel } from "../form";
import { Input } from "../input";
import { Textarea, TextareaProps } from "../textarea";

interface Props<T> {
  label?: string;
  placeholder?: string;
  className?: string;
  suffix?: string;
  type?: string;
  list?: boolean;
  size?: "sm" | "default" | "xs";
  prefix?: string;
  dir?: TextareaProps["dir"];
  // defaultValue?:boolean
}
export default function FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TOptionType = any,
>({
  label,
  placeholder,
  className,
  suffix,
  type,
  list,
  prefix,
  size = "default",
  dir,
  ...props
}: Partial<ControllerProps<TFieldValues, TName>> & Props<TOptionType>) {
  return (
    <FormField
      {...(props as any)}
      render={({ field, fieldState }) => (
        <FormItem className={cn(className, "mx-1")}>
          {label && (
            <FormLabel className={cn(fieldState.error && "border-red-400")}>
              {label}
            </FormLabel>
          )}
          <FormControl>
            <div
              className={cn(
                (suffix || prefix) && "flex items-center space-x-1",
                "flex flex-1 flex-col",
              )}
            >
              {prefix && (
                <Button
                  type="button"
                  size={size as any}
                  variant={"outline"}
                  className={cn(size == "sm" && "h-8")}
                >
                  {prefix}
                </Button>
              )}
              {type == "textarea" ? (
                <Textarea
                  dir={dir}
                  placeholder={placeholder}
                  className={cn(fieldState.error && "border-red-400", "flex-1")}
                  {...(list
                    ? {
                        defaultValue: field.value,
                        onChange: field.onChange,
                      }
                    : field)}
                  // value={""}
                />
              ) : (
                <Input
                  type={type}
                  dir={dir}
                  placeholder={placeholder}
                  // {...field}
                  // value={""}
                  className={cn(
                    fieldState.error && "border-red-400",
                    size == "sm" && "h-8",
                  )}
                  {...(list
                    ? {
                        defaultValue: field.value,
                        //   onChange: field.onChange,
                      }
                    : field)}
                  // onChange={field.onChange}
                  // defaultValue={field.value}
                  onChange={(e) => {
                    if (type == "number")
                      e.target.value
                        ? field.onChange(
                            e.target.value ? Number(e.target.value) : null,
                          )
                        : field.onChange(null);
                    else field.onChange(e);
                  }}
                />
              )}
              {suffix && (
                <Button
                  type="button"
                  size={size as any}
                  variant={"outline"}
                  className={cn(size == "sm" && "h-8")}
                >
                  {suffix}
                </Button>
              )}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
