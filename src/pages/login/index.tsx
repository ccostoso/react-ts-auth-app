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

import { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
});

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const navigate = useNavigate();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const url =
        import.meta.env.VITE_API_BASE_URL +
        import.meta.env.VITE_LOG_IN_ENDPOINT;
      const response = await axios.post(url, values);
      toast.success(response.data.message);
      const token = response.data.data;

      localStorage.setItem('token', token);

      // form.reset();
      navigate('/');
    } catch (e: unknown) {
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
        <h1 className="text-xl font-bold">Log in to your account</h1>
        <hr className="my-3 border border-gray-300" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <Button className="w-full" type="submit" disabled={loading}>
              Login
            </Button>
            <h1 className="text-sm">
              Don't have an account?{' '}
              <Link className="underline" to={'/register'}>
                Click here to register.
              </Link>
            </h1>
            <h1 className="text-sm">
              <Link className="underline" to={'/forgot-password'}>
                I forgot my password!
              </Link>
            </h1>
          </form>
        </Form>
      </section>
    </main>
  );
};

export default LoginPage;
