import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, MapPin, MessageCircle, Send } from "lucide-react";

import { PageShell } from "@/components/layout/PageShell";
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
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
    mode: "onSubmit",
  });

  function onSubmit(values: FormValues) {
    console.log("Contact form submitted:", values);
    toast.success("Message sent! We'll reply to " + values.email);
    form.reset();
  }

  return (
    <PageShell
      label="Contact"
      title={
        <>
          Talk to <span className="text-gradient-blue">us</span>.
        </>
      }
      subtitle="Questions, partnerships, feedback or press — we'd love to hear from you."
    >
      <div className="grid gap-6 md:grid-cols-3">
        <a
          href="mailto:chilengawarren307@gmail.com"
          className="rounded-2xl border border-border bg-card p-6 hover:shadow-glow transition"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Mail className="h-5 w-5" />
          </span>
          <h3 className="mt-4 font-semibold">Email</h3>
          <p className="text-muted-foreground text-sm break-all">
            chilengawarren307@gmail.com
          </p>
        </a>

        <a
          href="https://whatsapp.com/channel/0029Vb8NY5f84OmCRIr9K91V"
          target="_blank"
          rel="noreferrer"
          className="rounded-2xl border border-border bg-card p-6 hover:shadow-glow transition"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500 text-white">
            <MessageCircle className="h-5 w-5" />
          </span>
          <h3 className="mt-4 font-semibold">WhatsApp Channel</h3>
          <p className="text-muted-foreground text-sm">Follow for updates</p>
        </a>

        <div className="rounded-2xl border border-border bg-card p-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
            <MapPin className="h-5 w-5" />
          </span>
          <h3 className="mt-4 font-semibold">Based in</h3>
          <p className="text-muted-foreground text-sm">Kitwe, Zambia</p>
        </div>
      </div>

      <div className="mt-12 rounded-3xl border border-border bg-card p-8">
        <h3 className="font-display text-2xl font-semibold">
          Send a direct message
        </h3>
        <p className="mt-2 text-muted-foreground text-sm">
          Prefer email? Write to us at{" "}
          <a
            href="mailto:chilengawarren307@gmail.com"
            className="text-blue-600 underline"
          >
            chilengawarren307@gmail.com
          </a>
          .
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-4"
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
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
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
                    <Input
                      placeholder="What's this about?"
                      {...field}
                    />
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
                    <Textarea
                      rows={5}
                      placeholder="Your message..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-glow font-semibold"
            >
              <Send className="mr-2 h-4 w-4" />
              Send message
            </Button>
          </form>
        </Form>
      </div>
    </PageShell>
  );
}

