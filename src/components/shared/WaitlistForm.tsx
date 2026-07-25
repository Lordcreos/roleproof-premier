import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { waitlistSchema } from "../../schemas/domain";
import { submitWaitlist } from "../../services/roleproof-service";

type WaitlistValues = z.infer<typeof waitlistSchema>;

export function WaitlistForm() {
  const [result, setResult] = useState<"saved" | "duplicate" | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WaitlistValues>({
    resolver: zodResolver(waitlistSchema),
  });

  const onSubmit = async ({ email }: WaitlistValues) => {
    setResult(null);
    try {
      const response = await submitWaitlist(email);
      setResult(response.duplicate ? "duplicate" : "saved");
    } catch {
      setResult(null);
    }
  };

  if (result) {
    return (
      <div className="waitlist-success" role="status">
        <Check size={18} />
        <span>
          {result === "saved"
            ? "You're on the early-access list."
            : "You're already on the list."}
        </span>
      </div>
    );
  }

  return (
    <form className="waitlist-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label className="sr-only" htmlFor="waitlist-email">
          Email address
        </label>
        <input
          id="waitlist-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "waitlist-error" : undefined}
          {...register("email")}
        />
        {errors.email ? (
          <p className="field-error" id="waitlist-error">
            {errors.email.message}
          </p>
        ) : null}
      </div>
      <button className="button" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
        {isSubmitting ? <LoaderCircle className="spin" size={17} aria-hidden /> : null}
        {isSubmitting ? "Joining" : "Join early access"}
        {!isSubmitting ? <ArrowRight size={17} aria-hidden /> : null}
      </button>
    </form>
  );
}
