import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import styles from "./contact-form.module.css";

// Components
import { contactFormSchema } from "../../schemas/guest-contact-form";
import { IGuestUserInfo } from "../../types/guest-upload/guest-upload";
import Button from "../common/buttons/button";

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  data: IGuestUserInfo;
  onSubmit: (data: IGuestUserInfo) => void;
  teamName: string;
}

const ContactForm: React.FC<ContactFormProps> = ({
  data,
  onSubmit,
  teamName = "",
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: data,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles["form"]}>
      <>
        <div className={styles.container}>
          <div className={styles.row}>
            <label>First Name</label>
            <input id="firstName" {...register("firstName")} />
            {errors?.firstName && <p>{errors.firstName?.message}</p>}
          </div>
          <div className={styles.row}>
            <label>Last Name</label>
            <input id="lastName" {...register("lastName")} />
            {errors?.lastName && <p>{errors.lastName?.message}</p>}
          </div>
          <div className={styles.row}>
            <label>Email</label>
            <input id="email" {...register("email")} />
            {errors?.email && <p>{errors.email?.message}</p>}
          </div>
          <div className={styles.row}>
            <label>{`Message to ${teamName} (i.e. name of project, campaign etc.)`}</label>
            <textarea id="notes" {...register("notes")} />
            {errors?.notes && <p>{errors.notes?.message}</p>}
          </div>
          <Button
            type="submit"
            className="container primary"
            text="Save & Continue"
          />
        </div>
      </>
    </form>
  );
};

export default ContactForm;
