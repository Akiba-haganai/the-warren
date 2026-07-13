import { PageShell } from "../components/layout/PageShell";
import { Mail, MapPin, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Contact() {
  const form = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  function onSubmit(values: FormValues) {
    console.log(values);
    toast.success("Message sent! We'll get back to you soon.");
    form.reset();
  }

  return (
    <PageShell
      label="Contact"
      title={<>Talk to <span className="text-gradient-blue">us</span>.</>}
      subtitle="Questions, partnerships, feedback or press — we'd love to hear from you."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { icon: Mail, title: "Email", value: "hello@warrenhub.app" },
          { icon: MessageSquare, title: "Community", value: "Warren Hub Campus" },
          { icon: MapPin, title: "Based in", value: "Kitwe, Zambia" },
        ].map((c) => (
          <div key={c.title} className="rounded-2xl border border-border bg-card p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
              <c.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-semibold">{c.title}</h3>
            <p className="text-muted-foreground text-sm">{c.value}</p>
          </div>
        ))}
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-12 rounded-3xl border border-border bg-card p-8 space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="Subject" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea rows={5} placeholder="Your message" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full rounded-full bg-blue-600 text-white shadow-glow font-semibold"
          >
            Send message
          </Button>
        </form>
      </Form>
    </PageShell>
  );
}
