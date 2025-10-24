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
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { RESET_PASSWORD_ENDPOINT } from '@/constants';

const formSchema = z.object({
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
});

type FormSchema = z.infer<typeof formSchema>;

const ResetPasswordPage = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [loading, setLoading] = useState(false);
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      if (values.password !== values.confirmPassword) {
        toast.error('Passwords do not match.');
        return;
      }
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${RESET_PASSWORD_ENDPOINT}`,
        { newPassword: values.password, token }
      );
      toast.success(response.data.message);
      form.reset();
      navigate('/login');
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={loading}>
              Reset
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

export default ResetPasswordPage;
