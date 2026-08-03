"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProfile, updateProfile } from "@/services/profile";

const schema = z.object({
  full_name: z.string().min(2),
  age: z.number().min(1).max(120).optional().nullable(),
  gender: z.string().optional().nullable(),
  phone_number: z.string().optional().nullable(),
  email: z.string().email().optional().or(z.literal("")).nullable(),
  tobacco_habit: z.boolean().optional().nullable(),
  alcohol_habit: z.boolean().optional().nullable(),
  clinical_notes: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof schema>;

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["profile"], queryFn: getProfile });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: "",
      age: null,
      gender: "",
      phone_number: "",
      email: "",
      tobacco_habit: false,
      alcohol_habit: false,
      clinical_notes: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        full_name: data.full_name || "",
        age: data.age,
        gender: data.gender || "",
        phone_number: data.phone_number || "",
        email: data.email || "",
        tobacco_habit: !!data.tobacco_habit,
        alcohol_habit: !!data.alcohol_habit,
        clinical_notes: data.clinical_notes || "",
      });
    }
  }, [data, form]);

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => toast.error("Failed to update profile"),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader label="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">User Profile</h1>
        <p className="mt-1 text-[#a0a8b8]">Manage your clinical profile details.</p>
      </div>

      <form
        className="space-y-4 rounded-2xl border border-[#252840] bg-[#1a1d2e] p-6 shadow-sm"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="full_name">Name</Label>
            <Input id="full_name" {...form.register("full_name")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input id="age" type="number" {...form.register("age", { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <Select
              value={form.watch("gender") || ""}
              onValueChange={(v) => form.setValue("gender", v ?? "")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone</Label>
            <Input id="phone_number" {...form.register("phone_number")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register("email")} />
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <Checkbox
              id="tobacco"
              checked={!!form.watch("tobacco_habit")}
              onCheckedChange={(v) => form.setValue("tobacco_habit", v === true)}
            />
            <Label htmlFor="tobacco" className="font-normal">
              Tobacco Habit
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="alcohol"
              checked={!!form.watch("alcohol_habit")}
              onCheckedChange={(v) => form.setValue("alcohol_habit", v === true)}
            />
            <Label htmlFor="alcohol" className="font-normal">
              Alcohol Habit
            </Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="clinical_notes">Clinical Notes</Label>
          <Textarea id="clinical_notes" rows={4} {...form.register("clinical_notes")} />
        </div>

        <Button type="submit" className="bg-[#6dbf8f] text-[#0d1a14] hover:bg-[#5aad7d]" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </div>
  );
}
