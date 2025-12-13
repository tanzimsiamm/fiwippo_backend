/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

export const generateVerificationCode = (): string =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const sendVerificationEmail = async (email: string, code: string) => {
  console.log(`[DEV] Email verification code for ${email}: ${code}`);
};

export const sendPasswordResetEmail = async (email: string, code: string) => {
  console.log(`[DEV] Password reset code for ${email}: ${code}`);
};

export const buildAuthPayload = (user: any) => ({
  userId: user.id,
  email: user.email,
  organizationId: user.organizationId,
  role: user.role,
});
