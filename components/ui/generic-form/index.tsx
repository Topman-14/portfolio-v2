"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GenericFormProps } from "./data";
import { generateSchema, cn } from "@/lib/utils";
import { renderField } from "./modules";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function GenericForm({
  fields,
  onSubmit,
  schema,
  defaultValues = {},
  submitText = "Submit",
  className,
  itemName = 'Item',
  callBackRoute,
}: GenericFormProps) {
  
  const mergedDefaultValues = useMemo(() => {
    const fieldDefaults = fields.reduce((acc, field) => {
      if (field.defaultValue !== undefined) {
        acc[field.name] = field.defaultValue;
      }
      return acc;
    }, {} as Record<string, unknown>);

    return { ...fieldDefaults, ...defaultValues };
  }, [fields, defaultValues]);

  const generatedSchema = schema || generateSchema(fields);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(generatedSchema as any),
    defaultValues: mergedDefaultValues,
  });

  const handleSubmit = async (data: unknown) => {
    try {
      setIsLoading(true);
      await onSubmit(data);
      toast.success(`${itemName} submitted!`);
      if (callBackRoute) {
        console.log('pushing to', callBackRoute);
        router.push(callBackRoute);
      }
    } catch (error) {
      console.error(`${itemName} submission error:`, error);
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(handleSubmit)} 
        className={cn("space-y-6", className)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fields.map((field) => (
            <FormField
              key={field.name}
              control={form.control as any}
              name={field.name}
              render={() => (
                <FormItem 
                  className={cn(
                    "col-span-1",
                    field.colSpan === 2 && "md:col-span-2",
                    field.colSpan === 3 && "md:col-span-2 lg:col-span-3",
                    (field.type === "textarea" || field.type === "rich-text") && 
                    !field.colSpan && "md:col-span-2 lg:col-span-3"
                  )}
                >
                  <FormLabel>{field.label}</FormLabel>
                  <FormControl>
                    {renderField(field, form as any)}
                  </FormControl>
                  {field.description && (
                    <FormDescription>{field.description}</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isLoading}
            loading={isLoading}
          >
            {submitText}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export type { FieldConfig, GenericFormProps, FieldType, SelectOption } from "./data";
