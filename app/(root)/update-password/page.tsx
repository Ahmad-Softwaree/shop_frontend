import UpdatePasswordForm from "@/components/forms/UpdatePasswordForm";
import InvalidTokenCard from "@/components/cards/InvalidTokenCard";

const UpdatePasswordPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) => {
  let token = (await searchParams).token;
  let tokenIsValid = false;

  if (token) {
    // TODO: implement axios backend request here
    // const response = await axios.get(`/api/auth/validate-token/${token}`);
    // tokenIsValid = response.data.valid;

    // For now, assume token is valid if present
    tokenIsValid = true;
  }

  // Show invalid token card if token is not valid
  if (!tokenIsValid) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <InvalidTokenCard />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <UpdatePasswordForm token={token} />
    </div>
  );
};

export default UpdatePasswordPage;
