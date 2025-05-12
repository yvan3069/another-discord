"use client";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";

import { z } from "zod";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";

enum GenderEnum {
  female = "female",
  male = "male",
  other = "other",
}

interface IFormInput {
  firstName: string;
  gender: GenderEnum;
}

interface IFormInput2 {
  firstName: string;
  lastName: string;
  iceCreamType: string;
}

// for shadcnui
const FormSchema = z.object({
  username: z.string().min(2, {
    message: "username must be at least 2 characters",
  }),
});

export default function Test() {
  const { register, handleSubmit } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data);

  const form2 = useForm<IFormInput2>({
    defaultValues: {
      firstName: "",
      lastName: "",
      iceCreamType: "chocolate",
    },
  });
  const onSubmit2: SubmitHandler<IFormInput2> = (data) =>
    console.log(data, form2.formState);

  // for shadcn ui
  const form3 = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  });

  return (
    <>
      {/*类型注册 */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>First Name</label>
        <input type="text" {...register("firstName")} />
        <select {...register("gender")}>
          <option value="female">female</option>
          <option value="male">male</option>
          <option value="other">other</option>
        </select>
        <button type="submit">submit</button>
      </form>
      {/*与外部 UI 组件库集成。如果组件不公开输入的 ref，那么你应该使用 控制器 组件  */}
      <form onSubmit={form2.handleSubmit(onSubmit2)}>
        <Controller
          name="firstName"
          control={form2.control}
          render={({ field }) => <input {...field} />}
        />
        <Controller
          name="lastName"
          control={form2.control}
          render={({ field, fieldState: { error } }) => (
            <>
              <input {...field} />
              {error && <p>{error.message}</p>}
            </>
          )}
          rules={{
            required: "you have to put the lastname",
            minLength: { value: 2, message: "名字至少需要2个字符" },
          }}
        />
        <Controller
          name="iceCreamType"
          control={form2.control}
          render={({ field }) => (
            <select
              value={field.value || "chocolate"}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              ref={field.ref}
            >
              <option value="chocolate">chocolate</option>
              <option value="strawberry">strawberry</option>
              <option value="vanilla">vanilla</option>
            </select>
          )}
        />
        <button type="submit">submit</button>
      </form>
      {/* 整合受控输入, 提供了一个封装器组件 控制器，以简化集成过程，同时仍然让你可以自由地使用自定义注册*/}
      <Form {...form3}>
        <form>
          <FormField
            control={form3.control}
            name="username"
            render={({ field }) => (
              <FormControl>
                <Input {...field} />
              </FormControl>
            )}
          />
        </form>
      </Form>
    </>
  );
}
