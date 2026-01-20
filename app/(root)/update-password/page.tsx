import UpdatePasswordForm from "@/components/forms/UpdatePasswordForm";
import InvalidTokenCard from "@/components/cards/InvalidTokenCard";
import { verifyResetPasswordToken } from "@/lib/react-query/actions/auth.action";

const UpdatePasswordPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) => {
  const { token } = await searchParams;
  let tokenIsValid = false;

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <InvalidTokenCard />
      </div>
    );
  }

  try {
    const data = await verifyResetPasswordToken(token);

    if (data?.message === "VALID_RESET_TOKEN") {
      tokenIsValid = true;
    }
  } catch (err: any) {
    tokenIsValid = false;
  }

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
