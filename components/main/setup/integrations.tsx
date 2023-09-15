import IntegrationsComponent from "./integrations-component";

const Integrations = ({ ActionButtons }) => {
  const onSave = async () => {
    // TODO: Each integration operation is atomic, this save doesn't really do anything
  };

  return (
    <div>
      <IntegrationsComponent />
      <ActionButtons saveAction={onSave} />
    </div>
  );
};

export default Integrations;
