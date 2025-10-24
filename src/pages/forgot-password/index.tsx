import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { SEND_PASSWORD_RESET_EMAIL_ENDPOINT } from '@/constants';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
});

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }${SEND_PASSWORD_RESET_EMAIL_ENDPOINT}?email=${values.email}`,
        values
      );
      toast.success(response.data.message);
      form.reset();
    } catch (e) {
      if (axios.isAxiosError(e)) {
        toast.error(
          e.response?.data?.message ||
            e.message ||
            'An unexpected error occurred'
        );
      } else if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex justify-center items-center h-screen">
      <section className="border border-gray-300 p-5 rounded shadow flex flex-col w-[450px]">
        <h1 className="text-xl font-bold">Reset your password</h1>
        <hr className="my-3 border border-gray-300" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Enter your email to reset your password.
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={loading}>
              Send reset link
            </Button>
            <h1 className="text-sm">
              <Link className="underline" to={'/login'}>
                Click here to log in.
              </Link>
            </h1>
          </form>
        </Form>
      </section>
    </main>
  );
};

export default ForgotPasswordPage;
