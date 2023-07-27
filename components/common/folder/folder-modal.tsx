import { useForm } from "react-hook-form";
import styles from "./folder-modal.module.css";

// Components
import Button from "../../common/buttons/button";
import FormInput from "../../common/inputs/form-input";
import Input from "../../common/inputs/input";
import Base from "../../common/modals/base";

const FolderModal = ({ modalIsOpen, closeModal, onSubmit }) => {
  const { control, handleSubmit, errors } = useForm();

  return (
    <Base modalIsOpen={modalIsOpen} closeModal={closeModal}>
      <div className={styles.folder_modal}>
        <h3>Create Your New Collection</h3>
        <div className={styles.folder_modal_input}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormInput
              InputComponent={
                <Input
                  type="text"
                  placeholder="Name Your Collection"
                  styleType="regular-short"
                />
              }
              name="name"
              control={control}
              message={"This field should be between 1 and 30 characters long"}
              rules={{ minLength: 1, maxLength: 70, required: true }}
              errors={errors}
            />
            <div className={styles.buttons_container}>
              <div className={styles.cancel_button}>
                <Button
                  text="Cancel"
                  onClick={closeModal}
                  type=""
                  styleType="secondary"
                />
              </div>
              <Button text="Save" type="normal-height" styleType="primary" />
            </div>
          </form>
        </div>
      </div>
    </Base>
  );
};

export default FolderModal;
